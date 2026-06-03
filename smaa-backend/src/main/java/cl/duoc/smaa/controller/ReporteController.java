package cl.duoc.smaa.controller;

import cl.duoc.smaa.dto.ReporteResumenResponse;
import cl.duoc.smaa.service.ReporteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {
    private final ReporteService service;
    public ReporteController(ReporteService service) { this.service = service; }
    @GetMapping("/resumen") public ReporteResumenResponse resumen() { return service.resumen(); }
}
