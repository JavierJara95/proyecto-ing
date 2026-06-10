package cl.duoc.smaa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "declaraciones_viaje", uniqueConstraints = @UniqueConstraint(columnNames = "folio"))
public class DeclaracionViaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String folio;

    @NotBlank(message = "El nombre del titular es obligatorio")
    private String nombreTitular;

    @NotBlank(message = "El documento del titular es obligatorio")
    private String documentoTitular;

    @NotNull(message = "La fecha de viaje es obligatoria")
    private LocalDate fechaViaje;

    @NotBlank(message = "El paso fronterizo es obligatorio")
    private String pasoFronterizo;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El sentido de cruce es obligatorio")
    private SentidoCruce sentidoCruce;

    @NotBlank(message = "El medio de transporte es obligatorio")
    private String medioTransporte;

    @Enumerated(EnumType.STRING)
    private EstadoDeclaracion estado = EstadoDeclaracion.BORRADOR;

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }
    public String getNombreTitular() { return nombreTitular; }
    public void setNombreTitular(String nombreTitular) { this.nombreTitular = nombreTitular; }
    public String getDocumentoTitular() { return documentoTitular; }
    public void setDocumentoTitular(String documentoTitular) { this.documentoTitular = documentoTitular; }
    public LocalDate getFechaViaje() { return fechaViaje; }
    public void setFechaViaje(LocalDate fechaViaje) { this.fechaViaje = fechaViaje; }
    public String getPasoFronterizo() { return pasoFronterizo; }
    public void setPasoFronterizo(String pasoFronterizo) { this.pasoFronterizo = pasoFronterizo; }
    public SentidoCruce getSentidoCruce() { return sentidoCruce; }
    public void setSentidoCruce(SentidoCruce sentidoCruce) { this.sentidoCruce = sentidoCruce; }
    public String getMedioTransporte() { return medioTransporte; }
    public void setMedioTransporte(String medioTransporte) { this.medioTransporte = medioTransporte; }
    public EstadoDeclaracion getEstado() { return estado; }
    public void setEstado(EstadoDeclaracion estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
