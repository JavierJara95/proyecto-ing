package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import cl.duoc.smaa.model.Vehiculo;
import org.springframework.stereotype.Service;

@Service
public class FiscalizacionService {
    private final DeclaracionViajeService declaracionService;
    private final VehiculoService vehiculoService;

    public FiscalizacionService(DeclaracionViajeService declaracionService, VehiculoService vehiculoService) {
        this.declaracionService = declaracionService;
        this.vehiculoService = vehiculoService;
    }

    public DeclaracionViaje buscarPorFolio(String folio) { return declaracionService.buscarPorFolio(folio); }

    public DeclaracionViaje buscarPorQr(String codigoQr) {
        if (!codigoQr.startsWith("SMAA-QR-")) throw new BusinessException("Código QR no válido");
        String folio = codigoQr.replace("SMAA-QR-", "");
        return declaracionService.buscarPorFolio(folio);
    }

    public DeclaracionViaje buscarPorPatente(String patente) {
        Vehiculo vehiculo = vehiculoService.buscarPorPatente(patente);
        if (vehiculo.getDeclaracionViaje() == null) throw new BusinessException("El vehículo no tiene declaración asociada");
        return vehiculo.getDeclaracionViaje();
    }

    public DeclaracionViaje aprobar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.APROBADA, "Aprobado por fiscalización"); }
    public DeclaracionViaje observar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.OBSERVADA, "Observado por fiscalización"); }
    public DeclaracionViaje derivar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.DERIVADA, "Derivado a revisión especializada SAG/PDI"); }
}
