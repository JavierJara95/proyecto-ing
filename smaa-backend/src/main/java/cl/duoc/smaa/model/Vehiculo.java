package cl.duoc.smaa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "vehiculos", uniqueConstraints = @UniqueConstraint(columnNames = "patente"))
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La patente es obligatoria")
    private String patente;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "El año es obligatorio")
    private Integer anio;

    @NotBlank(message = "El propietario es obligatorio")
    private String propietario;

    @NotBlank(message = "El conductor autorizado es obligatorio")
    private String conductorAutorizado;

    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDate fechaSalida;

    @NotNull(message = "La fecha de retorno es obligatoria")
    private LocalDate fechaRetorno;

    private Boolean permisoTemporal = false;

    @Enumerated(EnumType.STRING)
    private EstadoPermiso estadoPermiso = EstadoPermiso.PENDIENTE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "declaracion_id")
    private DeclaracionViaje declaracionViaje;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatente() { return patente; }
    public void setPatente(String patente) { this.patente = patente; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public String getPropietario() { return propietario; }
    public void setPropietario(String propietario) { this.propietario = propietario; }
    public String getConductorAutorizado() { return conductorAutorizado; }
    public void setConductorAutorizado(String conductorAutorizado) { this.conductorAutorizado = conductorAutorizado; }
    public LocalDate getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(LocalDate fechaSalida) { this.fechaSalida = fechaSalida; }
    public LocalDate getFechaRetorno() { return fechaRetorno; }
    public void setFechaRetorno(LocalDate fechaRetorno) { this.fechaRetorno = fechaRetorno; }
    public Boolean getPermisoTemporal() { return permisoTemporal; }
    public void setPermisoTemporal(Boolean permisoTemporal) { this.permisoTemporal = permisoTemporal; }
    public EstadoPermiso getEstadoPermiso() { return estadoPermiso; }
    public void setEstadoPermiso(EstadoPermiso estadoPermiso) { this.estadoPermiso = estadoPermiso; }
    public DeclaracionViaje getDeclaracionViaje() { return declaracionViaje; }
    public void setDeclaracionViaje(DeclaracionViaje declaracionViaje) { this.declaracionViaje = declaracionViaje; }
}
