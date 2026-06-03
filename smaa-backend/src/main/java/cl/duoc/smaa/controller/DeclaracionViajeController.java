package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.service.DeclaracionViajeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/declaraciones")
@CrossOrigin(origins = "*")
public class DeclaracionViajeController {
    private final DeclaracionViajeService service;
    public DeclaracionViajeController(DeclaracionViajeService service) { this.service = service; }
    @PostMapping public ResponseEntity<DeclaracionViaje> crear(@Valid @RequestBody DeclaracionViaje declaracion) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(declaracion)); }
    @GetMapping public List<DeclaracionViaje> listar() { return service.listar(); }
    @GetMapping("/{id}") public DeclaracionViaje buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }
    @GetMapping("/folio/{folio}") public DeclaracionViaje buscarPorFolio(@PathVariable String folio) { return service.buscarPorFolio(folio); }
    @GetMapping("/documento/{documento}") public List<DeclaracionViaje> buscarPorDocumento(@PathVariable String documento) { return service.buscarPorDocumento(documento); }
    @PutMapping("/{id}/finalizar") public DeclaracionViaje finalizar(@PathVariable Long id) { return service.finalizar(id); }
}
