package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.Auditoria;
import cl.duoc.smaa.service.AuditoriaService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {
    private final AuditoriaService service;
    public AuditoriaController(AuditoriaService service) { this.service = service; }
    @GetMapping public List<Auditoria> listar() { return service.listar(); }
}
