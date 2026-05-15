import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import type { Response } from 'express';

export interface ExcelColumn {
  /** Texto de la cabecera visible en el Excel */
  header: string;
  /** Clave del objeto de datos que se mapea a esta columna */
  key: string;
  /** Ancho de la columna en caracteres (default 20) */
  width?: number;
  /** Alineación del contenido de la columna (default 'left') */
  align?: 'left' | 'center' | 'right';
  /** Formato de número de la celda, ej: '#,##0.00' */
  numFmt?: string;
}

export interface ExcelOptions {
  /** Color de fondo de las cabeceras en formato ARGB (default: azul oscuro) */
  headerColor?: string;
  /** Color del texto de las cabeceras (default: blanco) */
  headerFontColor?: string;
  /** Activa filas con colores alternados (default: true) */
  stripedRows?: boolean;
  /** Color de las filas pares en formato ARGB (default: gris muy claro) */
  stripeColor?: string;
}

@Injectable()
export class ExcelService {
  /**
   * Genera un buffer de Excel y lo envía directamente como descarga HTTP.
   * Úsalo en el controlador cuando quieras devolver el archivo al navegador.
   *
   * @param res Objeto Response de Express
   * @param filename Nombre del archivo sin extensión (ej: 'contratos_2026')
   * @param sheetName Nombre de la hoja
   * @param columns Definición de columnas
   * @param data Arreglo de objetos con los datos
   * @param options Opciones de estilo opcionales
   */
  async sendExcelFile(
    res: Response,
    filename: string,
    sheetName: string,
    columns: ExcelColumn[],
    data: any[],
    options?: ExcelOptions,
  ): Promise<void> {
    const buffer = await this.generateExcel(sheetName, columns, data, options);

    const safeFilename = `${filename}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFilename}"`,
    );
    res.setHeader('Content-Length', buffer.length);
    // Necesario para que el frontend pueda leer el header si usa fetch/axios
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.end(buffer);
  }

  /**
   * Genera un Buffer de Excel. Útsalo cuando necesites el buffer directamente
   * (por ejemplo, para enviarlo por email, guardarlo en disco, etc.)
   *
   * @param sheetName Nombre de la hoja de cálculo
   * @param columns Definición de las columnas
   * @param data Datos a rellenar en las filas
   * @param options Opciones de estilo
   * @returns Promise<Buffer>
   */
  async generateExcel(
    sheetName: string,
    columns: ExcelColumn[],
    data: any[],
    options?: ExcelOptions,
  ): Promise<Buffer> {
    const {
      headerColor = 'FF004E8A',
      headerFontColor = 'FFFFFFFF',
      stripedRows = true,
      stripeColor = 'FFF2F6FB',
    } = options ?? {};

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SGO Backend';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    // Definir columnas
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 20,
      style: {
        alignment: { horizontal: col.align ?? 'left', vertical: 'middle' },
        numFmt: col.numFmt,
      },
    }));

    // Estilizar la fila de cabeceras
    const headerRow = worksheet.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: headerFontColor }, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColor },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF000000' } },
      };
    });

    // Agregar filas de datos
    data.forEach((item, index) => {
      const row = worksheet.addRow(item);
      row.height = 18;

      // Filas alternadas
      if (stripedRows && index % 2 !== 0) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: stripeColor },
          };
        });
      }

      // Bordes suaves en cada celda
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        };
      });
    });

    // Auto-filter sobre las cabeceras
    if (data.length > 0) {
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
      };
    }

    // Fijar la fila de cabecera al hacer scroll
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as any as Buffer;
  }
}
