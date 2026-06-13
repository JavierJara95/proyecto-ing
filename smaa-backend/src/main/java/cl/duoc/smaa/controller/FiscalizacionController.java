package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.service.FiscalizacionService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fiscalizacion")
@CrossOrigin(origins = "*")
public class FiscalizacionController {
    private final FiscalizacionService service;
    public FiscalizacionController(FiscalizacionService service) { this.service = service; }
    @GetMapping("/folio/{folio}") public Map<String, Object> porFolio(@PathVariable String folio) { return service.buscarExpedienteCompletoPorFolio(folio); }
    @GetMapping("/qr/{codigoQr}") public DeclaracionViaje porQr(@PathVariable String codigoQr) { return service.buscarPorQr(codigoQr); }
    @GetMapping("/patente/{patente}") public Map<String, Object> porPatente(@PathVariable String patente) { return service.buscarExpedienteCompletoPorPatente(patente); }
    @PutMapping("/{id}/aprobar") public DeclaracionViaje aprobar(@PathVariable Long id) { return service.aprobar(id); }
    @PutMapping("/{id}/observar") public DeclaracionViaje observar(@PathVariable Long id) { return service.observar(id); }
    @PutMapping("/{id}/derivar") public DeclaracionViaje derivar(@PathVariable Long id) { return service.derivar(id); }
}
