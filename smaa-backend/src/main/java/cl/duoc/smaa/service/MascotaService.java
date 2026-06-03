package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.Mascota;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import cl.duoc.smaa.repository.MascotaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MascotaService {
    private final MascotaRepository repository;
    private final DeclaracionViajeRepository declaracionRepository;
    private final AuditoriaService auditoriaService;

    public MascotaService(MascotaRepository repository, DeclaracionViajeRepository declaracionRepository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.declaracionRepository = declaracionRepository;
        this.auditoriaService = auditoriaService;
    }

    public Mascota crear(Mascota mascota) {
        if (!Boolean.TRUE.equals(mascota.getCertificadoSanitario())) {
            throw new BusinessException("La mascota debe tener certificado sanitario");
        }
        if (!Boolean.TRUE.equals(mascota.getVacunaVigente())) {
            throw new BusinessException("La mascota debe tener vacuna vigente");
        }
        if (mascota.getDeclaracionViaje() != null && mascota.getDeclaracionViaje().getId() != null) {
            DeclaracionViaje declaracion = declaracionRepository.findById(mascota.getDeclaracionViaje().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Declaración asociada no encontrada"));
            mascota.setDeclaracionViaje(declaracion);
        }
        Mascota guardada = repository.save(mascota);
        auditoriaService.registrar("viajero", "CREAR", "MASCOTAS", "Mascota registrada: " + guardada.getNombre());
        return guardada;
    }

    public List<Mascota> listar() { return repository.findAll(); }
    public List<Mascota> buscarPorDeclaracion(Long idDeclaracion) { return repository.findByDeclaracionViajeId(idDeclaracion); }
}
