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
}
