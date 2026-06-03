package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import cl.duoc.smaa.model.EstadoValidacion;
import cl.duoc.smaa.model.MenorEdad;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import cl.duoc.smaa.repository.MenorEdadRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MenorEdadService {
    private final MenorEdadRepository repository;
    private final DeclaracionViajeRepository declaracionRepository;
    private final AuditoriaService auditoriaService;

    public MenorEdadService(MenorEdadRepository repository, DeclaracionViajeRepository declaracionRepository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.declaracionRepository = declaracionRepository;
        this.auditoriaService = auditoriaService;
    }

    public MenorEdad crear(MenorEdad menor) {
        DeclaracionViaje declaracion = obtenerDeclaracion(menor);
        menor.setDeclaracionViaje(declaracion);
        boolean ok = Boolean.TRUE.equals(menor.getViajaConAmbosPadres()) || Boolean.TRUE.equals(menor.getTieneAutorizacionNotarial());
        if (ok) {
            menor.setEstadoValidacion(EstadoValidacion.VALIDADO);
            menor.setObservacion("Documentación de menor validada");
        } else {
            menor.setEstadoValidacion(EstadoValidacion.OBSERVADO);
            menor.setObservacion("Falta autorización notarial para menor que no viaja con ambos padres");
            declaracion.setEstado(EstadoDeclaracion.OBSERVADA);
            declaracionRepository.save(declaracion);
        }
        MenorEdad guardado = repository.save(menor);
        auditoriaService.registrar("viajero", "CREAR", "MENORES", "Menor registrado con estado " + guardado.getEstadoValidacion());
        return guardado;
    }

    public List<MenorEdad> listar() { return repository.findAll(); }
    public List<MenorEdad> buscarPorDeclaracion(Long idDeclaracion) { return repository.findByDeclaracionViajeId(idDeclaracion); }

    private DeclaracionViaje obtenerDeclaracion(MenorEdad menor) {
        if (menor.getDeclaracionViaje() == null || menor.getDeclaracionViaje().getId() == null) {
            throw new ResourceNotFoundException("Debe asociar el menor a una declaración existente");
        }
        return declaracionRepository.findById(menor.getDeclaracionViaje().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Declaración asociada no encontrada"));
    }
}
