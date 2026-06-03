package cl.duoc.smaa.service;

import cl.duoc.smaa.model.Auditoria;
import cl.duoc.smaa.repository.AuditoriaRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {
    private final AuditoriaRepository repository;
    public AuditoriaService(AuditoriaRepository repository) { this.repository = repository; }

    public void registrar(String usuario, String accion, String modulo, String detalle) {
        Auditoria auditoria = new Auditoria();
        auditoria.setUsuario(usuario == null ? "sistema" : usuario);
        auditoria.setAccion(accion);
        auditoria.setModulo(modulo);
        auditoria.setDetalle(detalle);
        auditoria.setFechaHora(LocalDateTime.now());
        repository.save(auditoria);
    }

    public List<Auditoria> listar() { return repository.findAll(); }
}
