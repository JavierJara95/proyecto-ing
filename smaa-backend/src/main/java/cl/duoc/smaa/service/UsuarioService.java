package cl.duoc.smaa.service;

import cl.duoc.smaa.dto.LoginRequest;
import cl.duoc.smaa.dto.LoginResponse;
import cl.duoc.smaa.exception.BusinessException;
import cl.duoc.smaa.exception.ResourceNotFoundException;
import cl.duoc.smaa.model.Usuario;
import cl.duoc.smaa.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final AuditoriaService auditoriaService;

    public UsuarioService(UsuarioRepository repository, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.auditoriaService = auditoriaService;
    }

    public Usuario crear(Usuario usuario) {
        if (repository.existsByCorreo(usuario.getCorreo())) throw new BusinessException("Ya existe un usuario con ese correo");
        if (repository.existsByDocumento(usuario.getDocumento())) throw new BusinessException("Ya existe un usuario con ese documento");
        Usuario guardado = repository.save(usuario);
        auditoriaService.registrar(usuario.getCorreo(), "CREAR", "USUARIOS", "Usuario creado con rol " + usuario.getRol());
        return guardado;
    }

    public List<Usuario> listar() { return repository.findAll(); }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID " + id));
    }

    public Usuario buscarPorCorreo(String correo) {
        return repository.findByCorreo(correo).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo " + correo));
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = buscarPorCorreo(request.getCorreo());
        if (!Boolean.TRUE.equals(usuario.getActivo())) throw new BusinessException("El usuario está inactivo");
        if (!usuario.getPassword().equals(request.getPassword())) throw new BusinessException("Credenciales incorrectas");
        auditoriaService.registrar(usuario.getCorreo(), "LOGIN", "USUARIOS", "Inicio de sesión simulado correcto");
        return new LoginResponse(true, "Login correcto", usuario.getId(), usuario.getNombre() + " " + usuario.getApellido(), usuario.getRol());
    }
}
