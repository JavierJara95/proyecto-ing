package cl.duoc.smaa.service;

import cl.duoc.smaa.dto.ComprobanteResponse;
import cl.duoc.smaa.model.DeclaracionViaje;
import org.springframework.stereotype.Service;

@Service
public class ComprobanteService {
    private final DeclaracionViajeService declaracionService;
    private final AuditoriaService auditoriaService;

    public ComprobanteService(DeclaracionViajeService declaracionService, AuditoriaService auditoriaService) {
        this.declaracionService = declaracionService;
        this.auditoriaService = auditoriaService;
    }

    public ComprobanteResponse generar(String folio) {
        DeclaracionViaje d = declaracionService.buscarPorFolio(folio);
        String qr = "SMAA-QR-" + d.getFolio();
        auditoriaService.registrar(d.getDocumentoTitular(), "GENERAR", "COMPROBANTE", "Comprobante generado con QR " + qr);
        return new ComprobanteResponse(d.getFolio(), qr, d.getNombreTitular(), d.getDocumentoTitular(), d.getFechaViaje(), d.getPasoFronterizo(), d.getEstado(), "Comprobante generado correctamente");
    }
}
