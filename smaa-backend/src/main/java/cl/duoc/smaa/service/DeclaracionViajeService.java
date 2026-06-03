package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import cl.duoc.smaa.model.EstadoRevisionSag;
import cl.duoc.smaa.repository.DeclaracionSagRepository;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DeclaracionViajeService {
    private final DeclaracionViajeRepository repository;
    private final DeclaracionSagRepository sagRepository;
    private final AuditoriaService auditoriaService;

    public DeclaracionViajeService(DeclaracionViajeRepository repository, DeclaracionSagRepository sagRepository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.sagRepository = sagRepository;
        this.auditoriaService = auditoriaService;
    }

    public DeclaracionViaje crear(DeclaracionViaje declaracion) {
        declaracion.setEstado(EstadoDeclaracion.BORRADOR);
        declaracion.setFechaCreacion(LocalDateTime.now());
        DeclaracionViaje guardada = repository.save(declaracion);
        guardada.setFolio(String.format("SMAA-2026-%04d", guardada.getId()));
        guardada = repository.save(guardada);
        auditoriaService.registrar(declaracion.getDocumentoTitular(), "CREAR", "DECLARACIONES", "Declaración creada con folio " + guardada.getFolio());
        return guardada;
    }

    public List<DeclaracionViaje> listar() { return repository.findAll(); }

    public DeclaracionViaje buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Declaración no encontrada con ID " + id));
    }

    public DeclaracionViaje buscarPorFolio(String folio) {
        return repository.findByFolio(folio).orElseThrow(() -> new ResourceNotFoundException("Declaración no encontrada con folio " + folio));
    }

    public List<DeclaracionViaje> buscarPorDocumento(String documento) {
        return repository.findByDocumentoTitular(documento);
    }

    public DeclaracionViaje finalizar(Long id) {
        DeclaracionViaje declaracion = buscarPorId(id);
        declaracion.setEstado(EstadoDeclaracion.PENDIENTE);
        auditoriaService.registrar(declaracion.getDocumentoTitular(), "FINALIZAR", "DECLARACIONES", "Declaración finalizada y enviada a revisión");
        return repository.save(declaracion);
    }

    public DeclaracionViaje cambiarEstado(Long id, EstadoDeclaracion estado, String motivo) {
        DeclaracionViaje declaracion = buscarPorId(id);
        if (estado == EstadoDeclaracion.APROBADA && sagRepository.existsByDeclaracionViajeIdAndEstadoRevision(id, EstadoRevisionSag.ALERTA_REVISION)) {
            throw new BusinessException("No se puede aprobar: existe alerta SAG pendiente de revisión");
        }
        declaracion.setEstado(estado);
        auditoriaService.registrar("funcionario", "CAMBIAR_ESTADO", "FISCALIZACION", "Estado cambiado a " + estado + ". Motivo: " + motivo);
        return repository.save(declaracion);
    }
}
