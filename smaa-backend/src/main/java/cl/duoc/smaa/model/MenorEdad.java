package cl.duoc.smaa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "menores_edad")
public class MenorEdad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del menor es obligatorio")
    private String nombre;

    @NotBlank(message = "El documento del menor es obligatorio")
    private String documento;

    private Boolean viajaConAmbosPadres = false;
    private Boolean tieneAutorizacionNotarial = false;

    @Column(length = 1000)
    private String observacion;

    @Enumerated(EnumType.STRING)
    private EstadoValidacion estadoValidacion = EstadoValidacion.PENDIENTE;



    @Column(length = 512)
    private String archivoRespaldoNombre;

    @Column(length = 255)
    private String archivoRespaldoTipo;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String archivoRespaldoDatos;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "declaracion_id")
    private DeclaracionViaje declaracionViaje;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public Boolean getViajaConAmbosPadres() { return viajaConAmbosPadres; }
    public void setViajaConAmbosPadres(Boolean viajaConAmbosPadres) { this.viajaConAmbosPadres = viajaConAmbosPadres; }
    public Boolean getTieneAutorizacionNotarial() { return tieneAutorizacionNotarial; }
    public void setTieneAutorizacionNotarial(Boolean tieneAutorizacionNotarial) { this.tieneAutorizacionNotarial = tieneAutorizacionNotarial; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public EstadoValidacion getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(EstadoValidacion estadoValidacion) { this.estadoValidacion = estadoValidacion; }
    public DeclaracionViaje getDeclaracionViaje() { return declaracionViaje; }
    public void setDeclaracionViaje(DeclaracionViaje declaracionViaje) { this.declaracionViaje = declaracionViaje; }

    public String getArchivoRespaldoNombre() { return archivoRespaldoNombre; }
    public void setArchivoRespaldoNombre(String archivoRespaldoNombre) { this.archivoRespaldoNombre = limitarTexto(archivoRespaldoNombre, 180); }
    public String getArchivoRespaldoTipo() { return archivoRespaldoTipo; }
    public void setArchivoRespaldoTipo(String archivoRespaldoTipo) { this.archivoRespaldoTipo = archivoRespaldoTipo; }
    public String getArchivoRespaldoDatos() { return archivoRespaldoDatos; }
    public void setArchivoRespaldoDatos(String archivoRespaldoDatos) { this.archivoRespaldoDatos = archivoRespaldoDatos; }

    private String limitarTexto(String valor, int maximo) {
        if (valor == null) return null;
        String limpio = valor.trim();
        if (limpio.length() <= maximo) return limpio;

        int ultimoPunto = limpio.lastIndexOf('.');
        String extension = ultimoPunto > 0 ? limpio.substring(ultimoPunto) : "";
        if (extension.length() > 20) extension = extension.substring(0, 20);
        int maxBase = Math.max(20, maximo - extension.length() - 12);
        String base = ultimoPunto > 0 ? limpio.substring(0, ultimoPunto) : limpio;
        return base.substring(0, Math.min(base.length(), maxBase)) + "_recortado" + extension;
    }
}