declare module "pdf-parse" {
  type PdfParseResult = {
    text: string;
    numpages: number;
    numrender: number;
    info?: Record<string, unknown>;
    metadata?: unknown;
    version?: string;
  };

  function pdf(buffer: Buffer): Promise<PdfParseResult>;

  export default pdf;
}
