package cl.duoc.smaa.dto;

import cl.duoc.smaa.model.EstadoDeclaracion;
import java.time.LocalDate;

public class ComprobanteResponse {
    private String folio;
    private String codigoQr;
    private String nombreTitular;
    private String documentoTitular;
    private LocalDate fechaViaje;
    private String pasoFronterizo;
    private EstadoDeclaracion estado;
    private String mensaje;

    public ComprobanteResponse(String folio, String codigoQr, String nombreTitular, String documentoTitular,
                               LocalDate fechaViaje, String pasoFronterizo, EstadoDeclaracion estado, String mensaje) {
        this.folio = folio;
        this.codigoQr = codigoQr;
        this.nombreTitular = nombreTitular;
        this.documentoTitular = documentoTitular;
        this.fechaViaje = fechaViaje;
        this.pasoFronterizo = pasoFronterizo;
        this.estado = estado;
        this.mensaje = mensaje;
    }
    public String getFolio() { return folio; }
    public String getCodigoQr() { return codigoQr; }
    public String getNombreTitular() { return nombreTitular; }
    public String getDocumentoTitular() { return documentoTitular; }
    public LocalDate getFechaViaje() { return fechaViaje; }
    public String getPasoFronterizo() { return pasoFronterizo; }
    public EstadoDeclaracion getEstado() { return estado; }
    public String getMensaje() { return mensaje; }
}
