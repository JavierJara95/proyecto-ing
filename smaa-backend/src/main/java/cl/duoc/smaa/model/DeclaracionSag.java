package cl.duoc.smaa.model;

import jakarta.persistence.*;

@Entity
@Table(name = "declaraciones_sag")
public class DeclaracionSag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean declaraProductos = false;
    private String tipoProducto;
    private Boolean productoRestringido = false;

    @Column(length = 1000)
    private String observacion;

    @Enumerated(EnumType.STRING)
    private EstadoRevisionSag estadoRevision = EstadoRevisionSag.SIN_ALERTA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "declaracion_id")
    private DeclaracionViaje declaracionViaje;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Boolean getDeclaraProductos() { return declaraProductos; }
    public void setDeclaraProductos(Boolean declaraProductos) { this.declaraProductos = declaraProductos; }
    public String getTipoProducto() { return tipoProducto; }
    public void setTipoProducto(String tipoProducto) { this.tipoProducto = tipoProducto; }
    public Boolean getProductoRestringido() { return productoRestringido; }
    public void setProductoRestringido(Boolean productoRestringido) { this.productoRestringido = productoRestringido; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public EstadoRevisionSag getEstadoRevision() { return estadoRevision; }
    public void setEstadoRevision(EstadoRevisionSag estadoRevision) { this.estadoRevision = estadoRevision; }
    public DeclaracionViaje getDeclaracionViaje() { return declaracionViaje; }
    public void setDeclaracionViaje(DeclaracionViaje declaracionViaje) { this.declaracionViaje = declaracionViaje; }
}
