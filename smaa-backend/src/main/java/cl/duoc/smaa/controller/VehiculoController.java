package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.Vehiculo;
import cl.duoc.smaa.service.VehiculoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "*")
public class VehiculoController {
    private final VehiculoService service;
    public VehiculoController(VehiculoService service) { this.service = service; }
    @PostMapping public ResponseEntity<Vehiculo> crear(@Valid @RequestBody Vehiculo vehiculo) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(vehiculo)); }
    @GetMapping public List<Vehiculo> listar() { return service.listar(); }
    @GetMapping("/patente/{patente}") public Vehiculo buscarPorPatente(@PathVariable String patente) { return service.buscarPorPatente(patente); }
    @PutMapping("/{id}/generar-permiso") public Vehiculo generarPermiso(@PathVariable Long id) { return service.generarPermiso(id); }
}
