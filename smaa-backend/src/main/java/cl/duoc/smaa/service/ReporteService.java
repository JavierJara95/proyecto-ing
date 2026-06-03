package cl.duoc.smaa.service;

import cl.duoc.smaa.dto.ReporteResumenResponse;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import cl.duoc.smaa.repository.VehiculoRepository;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ReporteService {
    private final DeclaracionViajeRepository declaracionRepository;
    private final VehiculoRepository vehiculoRepository;

    public ReporteService(DeclaracionViajeRepository declaracionRepository, VehiculoRepository vehiculoRepository) {
        this.declaracionRepository = declaracionRepository;
        this.vehiculoRepository = vehiculoRepository;
    }

    public ReporteResumenResponse resumen() {
        Map<String, Long> porPaso = declaracionRepository.findAll().stream()
                .collect(Collectors.groupingBy(DeclaracionViaje::getPasoFronterizo, Collectors.counting()));
        return new ReporteResumenResponse(
                declaracionRepository.count(),
                declaracionRepository.countByEstado(EstadoDeclaracion.APROBADA),
                declaracionRepository.countByEstado(EstadoDeclaracion.OBSERVADA),
                declaracionRepository.countByEstado(EstadoDeclaracion.DERIVADA),
                vehiculoRepository.count(),
                porPaso
        );
    }
}
