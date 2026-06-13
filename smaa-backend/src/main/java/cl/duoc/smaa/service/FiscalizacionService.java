package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import cl.duoc.smaa.model.Vehiculo;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class FiscalizacionService {
    private final DeclaracionViajeService declaracionService;
    private final VehiculoService vehiculoService;
    private final MenorEdadService menorEdadService;
    private final MascotaService mascotaService;
    private final DeclaracionSagService declaracionSagService;

    public FiscalizacionService(
            DeclaracionViajeService declaracionService,
            VehiculoService vehiculoService,
            MenorEdadService menorEdadService,
            MascotaService mascotaService,
            DeclaracionSagService declaracionSagService) {
        this.declaracionService = declaracionService;
        this.vehiculoService = vehiculoService;
        this.menorEdadService = menorEdadService;
        this.mascotaService = mascotaService;
        this.declaracionSagService = declaracionSagService;
    }

    public DeclaracionViaje buscarPorFolio(String folio) { return declaracionService.buscarPorFolio(folio); }

    public Map<String, Object> buscarExpedienteCompletoPorFolio(String folio) {
        DeclaracionViaje declaracion = declaracionService.buscarPorFolio(folio);
        return construirExpedienteCompleto(declaracion);
    }

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

    public Map<String, Object> buscarExpedienteCompletoPorPatente(String patente) {
        DeclaracionViaje declaracion = buscarPorPatente(patente);
        return construirExpedienteCompleto(declaracion);
    }

    private Map<String, Object> construirExpedienteCompleto(DeclaracionViaje declaracion) {
        Map<String, Object> expediente = new LinkedHashMap<>();
        expediente.put("declaracion", declaracion);
        expediente.put("vehiculos", vehiculoService.buscarPorDeclaracion(declaracion.getId()));
        expediente.put("menores", menorEdadService.buscarPorDeclaracion(declaracion.getId()));
        expediente.put("mascotas", mascotaService.buscarPorDeclaracion(declaracion.getId()));
        expediente.put("declaracionesSag", declaracionSagService.buscarPorDeclaracion(declaracion.getId()));
        return expediente;
    }

    public DeclaracionViaje aprobar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.APROBADA, "Aprobado por fiscalización"); }
    public DeclaracionViaje observar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.OBSERVADA, "Observado por fiscalización"); }
    public DeclaracionViaje derivar(Long id) { return declaracionService.cambiarEstado(id, EstadoDeclaracion.DERIVADA, "Derivado a revisión especializada SAG/PDI"); }
}
