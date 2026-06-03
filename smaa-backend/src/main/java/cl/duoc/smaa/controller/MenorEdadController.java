package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.MenorEdad;
import cl.duoc.smaa.service.MenorEdadService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menores")
@CrossOrigin(origins = "*")
public class MenorEdadController {
    private final MenorEdadService service;
    public MenorEdadController(MenorEdadService service) { this.service = service; }
    @PostMapping public ResponseEntity<MenorEdad> crear(@Valid @RequestBody MenorEdad menor) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(menor)); }
    @GetMapping public List<MenorEdad> listar() { return service.listar(); }
    @GetMapping("/declaracion/{idDeclaracion}") public List<MenorEdad> porDeclaracion(@PathVariable Long idDeclaracion) { return service.buscarPorDeclaracion(idDeclaracion); }
}
