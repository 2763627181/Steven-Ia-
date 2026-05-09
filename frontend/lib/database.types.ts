export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string;
          nombre: string;
          rnc: string | null;
          plan: string;
          activa: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["empresas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["empresas"]["Insert"]>;
      };
      perfiles: {
        Row: {
          id: string;
          empresa_id: string | null;
          nombre: string | null;
          rol: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["perfiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["perfiles"]["Insert"]>;
      };
      empleados: {
        Row: {
          id: string;
          empresa_id: string;
          nombre: string;
          cedula: string | null;
          cargo: string | null;
          area: string | null;
          salario_bruto: number | null;
          tipo_contrato: string | null;
          fecha_ingreso: string | null;
          activo: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["empleados"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["empleados"]["Insert"]>;
      };
      facturas: {
        Row: {
          id: string;
          empresa_id: string;
          ncf: string;
          proveedor: string;
          rnc_proveedor: string | null;
          tipo_ncf: string | null;
          concepto: string | null;
          monto: number | null;
          itbis: number | null;
          fecha: string | null;
          estado: string;
          riesgo: string;
          alerta: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["facturas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["facturas"]["Insert"]>;
      };
      retenciones: {
        Row: {
          id: string;
          empresa_id: string;
          proveedor: string;
          rnc: string | null;
          tipo_persona: string | null;
          concepto: string | null;
          factura: string | null;
          monto: number | null;
          tasa_sugerida: number | null;
          monto_retencion: number | null;
          estado: string;
          riesgo: string;
          alerta: string | null;
          fecha: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["retenciones"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["retenciones"]["Insert"]>;
      };
      nomina_periodos: {
        Row: {
          id: string;
          empresa_id: string;
          periodo: string;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          estado: string;
          total_bruto: number | null;
          total_isr: number | null;
          total_tss_empleado: number | null;
          total_tss_empleador: number | null;
          total_neto: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["nomina_periodos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["nomina_periodos"]["Insert"]>;
      };
      nomina_empleados: {
        Row: {
          id: string;
          periodo_id: string;
          empleado_id: string | null;
          salario_bruto: number | null;
          isr: number | null;
          sfs_empleado: number | null;
          afp_empleado: number | null;
          rl_empleado: number | null;
          sfs_empleador: number | null;
          afp_empleador: number | null;
          rl_empleador: number | null;
          salario_neto: number | null;
          observacion: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["nomina_empleados"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["nomina_empleados"]["Insert"]>;
      };
      documentos: {
        Row: {
          id: string;
          empresa_id: string;
          empleado_id: string;
          nombre: string;
          estado: string;
          fecha_vencimiento: string | null;
          storage_path: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documentos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["documentos"]["Insert"]>;
      };
      contratos: {
        Row: {
          id: string;
          empresa_id: string;
          titulo: string;
          tipo: string | null;
          partes: string | null;
          fecha: string | null;
          vencimiento: string | null;
          estado: string;
          riesgo: string;
          clausulas_faltantes: string[] | null;
          observacion: string | null;
          storage_path: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contratos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contratos"]["Insert"]>;
      };
      alertas: {
        Row: {
          id: string;
          empresa_id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string | null;
          prioridad: string;
          modulo: string | null;
          leida: boolean;
          accion: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["alertas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["alertas"]["Insert"]>;
      };
      consentimientos: {
        Row: {
          id: string;
          empresa_id: string;
          empleado_id: string;
          tipo: string;
          estado: string;
          fecha_firma: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["consentimientos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["consentimientos"]["Insert"]>;
      };
    };
    Functions: {
      my_empresa_id: { Args: Record<never, never>; Returns: string };
    };
  };
}

export type Empresa       = Database["public"]["Tables"]["empresas"]["Row"];
export type Perfil        = Database["public"]["Tables"]["perfiles"]["Row"];
export type Empleado      = Database["public"]["Tables"]["empleados"]["Row"];
export type Factura       = Database["public"]["Tables"]["facturas"]["Row"];
export type Retencion     = Database["public"]["Tables"]["retenciones"]["Row"];
export type NominaPeriodo = Database["public"]["Tables"]["nomina_periodos"]["Row"];
export type NominaEmp     = Database["public"]["Tables"]["nomina_empleados"]["Row"];
export type Documento     = Database["public"]["Tables"]["documentos"]["Row"];
export type Contrato      = Database["public"]["Tables"]["contratos"]["Row"];
export type Alerta        = Database["public"]["Tables"]["alertas"]["Row"];
