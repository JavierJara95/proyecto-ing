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