package cl.duoc.smaa.controller;

import cl.duoc.smaa.dto.LoginRequest;
import cl.duoc.smaa.dto.LoginResponse;
import cl.duoc.smaa.model.Usuario;
import cl.duoc.smaa.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    private final UsuarioService service;
    public UsuarioController(UsuarioService service) { this.service = service; }
    @PostMapping public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(usuario)); }
    @GetMapping public List<Usuario> listar() { return service.listar(); }
    @GetMapping("/{id}") public Usuario buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }
    @GetMapping("/correo/{correo}") public Usuario buscarPorCorreo(@PathVariable String correo) { return service.buscarPorCorreo(correo); }
    @PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request) { return service.login(request); }
}
