package cl.duoc.smaa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El tipo de animal es obligatorio")
    private String tipoAnimal;

    @NotBlank(message = "El nombre de la mascota es obligatorio")
    private String nombre;

    private Boolean certificadoSanitario = false;
    private Boolean vacunaVigente = false;

    @Column(length = 1000)
    private String observacion;



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
    public String getTipoAnimal() { return tipoAnimal; }
    public void setTipoAnimal(String tipoAnimal) { this.tipoAnimal = tipoAnimal; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Boolean getCertificadoSanitario() { return certificadoSanitario; }
    public void setCertificadoSanitario(Boolean certificadoSanitario) { this.certificadoSanitario = certificadoSanitario; }
    public Boolean getVacunaVigente() { return vacunaVigente; }
    public void setVacunaVigente(Boolean vacunaVigente) { this.vacunaVigente = vacunaVigente; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
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