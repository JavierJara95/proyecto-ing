package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.DeclaracionSag;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoRevisionSag;
import cl.duoc.smaa.repository.DeclaracionSagRepository;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DeclaracionSagService {
    private final DeclaracionSagRepository repository;
    private final DeclaracionViajeRepository declaracionRepository;
    private final AuditoriaService auditoriaService;

    public DeclaracionSagService(DeclaracionSagRepository repository, DeclaracionViajeRepository declaracionRepository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.declaracionRepository = declaracionRepository;
        this.auditoriaService = auditoriaService;
    }

    public DeclaracionSag crear(DeclaracionSag sag) {
        asociarDeclaracionSiExiste(sag);
        if (Boolean.TRUE.equals(sag.getProductoRestringido())) {
            sag.setEstadoRevision(EstadoRevisionSag.ALERTA_REVISION);
            sag.setObservacion(sag.getObservacion() == null ? "Producto restringido: requiere revisión SAG" : sag.getObservacion());
        } else {
            sag.setEstadoRevision(EstadoRevisionSag.SIN_ALERTA);
        }
        DeclaracionSag guardado = repository.save(sag);
        auditoriaService.registrar("viajero", "CREAR", "SAG", "Declaración SAG registrada con estado " + guardado.getEstadoRevision());
        return guardado;
    }

    public List<DeclaracionSag> listar() { return repository.findAll(); }
    public List<DeclaracionSag> buscarPorDeclaracion(Long idDeclaracion) { return repository.findByDeclaracionViajeId(idDeclaracion); }

    public DeclaracionSag aprobar(Long id) {
        DeclaracionSag sag = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Declaración SAG no encontrada"));
        sag.setEstadoRevision(EstadoRevisionSag.APROBADA);
        auditoriaService.registrar("inspector_sag", "APROBAR", "SAG", "Declaración SAG aprobada ID " + id);
        return repository.save(sag);
    }

    public DeclaracionSag observar(Long id) {
        DeclaracionSag sag = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Declaración SAG no encontrada"));
        sag.setEstadoRevision(EstadoRevisionSag.OBSERVADA);
        auditoriaService.registrar("inspector_sag", "OBSERVAR", "SAG", "Declaración SAG observada ID " + id);
        return repository.save(sag);
    }

    private void asociarDeclaracionSiExiste(DeclaracionSag sag) {
        if (sag.getDeclaracionViaje() != null && sag.getDeclaracionViaje().getId() != null) {
            DeclaracionViaje declaracion = declaracionRepository.findById(sag.getDeclaracionViaje().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Declaración asociada no encontrada"));
            sag.setDeclaracionViaje(declaracion);
        }
    }
}
