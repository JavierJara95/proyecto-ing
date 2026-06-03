package cl.duoc.smaa.controller;

import cl.duoc.smaa.dto.ComprobanteResponse;
import cl.duoc.smaa.service.ComprobanteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comprobantes")
@CrossOrigin(origins = "*")
public class ComprobanteController {
    private final ComprobanteService service;
    public ComprobanteController(ComprobanteService service) { this.service = service; }
    @GetMapping("/{folio}") public ComprobanteResponse generar(@PathVariable String folio) { return service.generar(folio); }
}
