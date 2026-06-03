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
}
