package cl.duoc.smaa.service;

import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoPermiso;
import cl.duoc.smaa.model.Vehiculo;
import cl.duoc.smaa.repository.DeclaracionViajeRepository;
import cl.duoc.smaa.repository.VehiculoRepository;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VehiculoService {
    private final VehiculoRepository repository;
    private final DeclaracionViajeRepository declaracionRepository;
    private final AuditoriaService auditoriaService;

    public VehiculoService(VehiculoRepository repository, DeclaracionViajeRepository declaracionRepository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.declaracionRepository = declaracionRepository;
        this.auditoriaService = auditoriaService;
    }

    public Vehiculo crear(Vehiculo vehiculo) {
        if (repository.existsByPatente(vehiculo.getPatente())) throw new BusinessException("Ya existe un vehículo con esa patente");
        validarFechas(vehiculo);
        asociarDeclaracionSiExiste(vehiculo);
        Vehiculo guardado = repository.save(vehiculo);
        auditoriaService.registrar("viajero", "CREAR", "VEHICULOS", "Vehículo registrado patente " + guardado.getPatente());
        return guardado;
    }

    public List<Vehiculo> listar() { return repository.findAll(); }
    public List<Vehiculo> buscarPorDeclaracion(Long idDeclaracion) { return repository.findByDeclaracionViajeId(idDeclaracion); }

    public Vehiculo buscarPorPatente(String patente) {
        return repository.findByPatente(patente).orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con patente " + patente));
    }

    public Vehiculo generarPermiso(Long id) {
        Vehiculo vehiculo = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con ID " + id));
        validarFechas(vehiculo);
        vehiculo.setPermisoTemporal(true);
        vehiculo.setEstadoPermiso(EstadoPermiso.GENERADO);
        auditoriaService.registrar("funcionario", "GENERAR_PERMISO", "VEHICULOS", "Permiso temporal generado para patente " + vehiculo.getPatente());
        return repository.save(vehiculo);
    }

    private void validarFechas(Vehiculo vehiculo) {
        long dias = ChronoUnit.DAYS.between(vehiculo.getFechaSalida(), vehiculo.getFechaRetorno());
        if (dias < 0) throw new BusinessException("La fecha de retorno no puede ser anterior a la fecha de salida");
        if (dias > 180) throw new BusinessException("El permiso temporal no puede superar los 180 días");
    }

    private void asociarDeclaracionSiExiste(Vehiculo vehiculo) {
        if (vehiculo.getDeclaracionViaje() != null && vehiculo.getDeclaracionViaje().getId() != null) {
            DeclaracionViaje declaracion = declaracionRepository.findById(vehiculo.getDeclaracionViaje().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Declaración asociada no encontrada"));
            vehiculo.setDeclaracionViaje(declaracion);
        }
    }
}
