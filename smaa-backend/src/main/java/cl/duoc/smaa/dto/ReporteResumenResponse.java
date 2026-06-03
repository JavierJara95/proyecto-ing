package cl.duoc.smaa.dto;

import java.util.Map;

public class ReporteResumenResponse {
    private long totalDeclaraciones;
    private long aprobadas;
    private long observadas;
    private long derivadas;
    private long totalVehiculos;
    private Map<String, Long> cantidadPorPasoFronterizo;

    public ReporteResumenResponse(long totalDeclaraciones, long aprobadas, long observadas, long derivadas,
                                  long totalVehiculos, Map<String, Long> cantidadPorPasoFronterizo) {
        this.totalDeclaraciones = totalDeclaraciones;
        this.aprobadas = aprobadas;
        this.observadas = observadas;
        this.derivadas = derivadas;
        this.totalVehiculos = totalVehiculos;
        this.cantidadPorPasoFronterizo = cantidadPorPasoFronterizo;
    }
    public long getTotalDeclaraciones() { return totalDeclaraciones; }
    public long getAprobadas() { return aprobadas; }
    public long getObservadas() { return observadas; }
    public long getDerivadas() { return derivadas; }
    public long getTotalVehiculos() { return totalVehiculos; }
    public Map<String, Long> getCantidadPorPasoFronterizo() { return cantidadPorPasoFronterizo; }
}
