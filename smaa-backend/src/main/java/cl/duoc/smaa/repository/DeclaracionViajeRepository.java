package cl.duoc.smaa.repository;
import cl.duoc.smaa.model.DeclaracionViaje;
import cl.duoc.smaa.model.EstadoDeclaracion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DeclaracionViajeRepository extends JpaRepository<DeclaracionViaje, Long> {
    Optional<DeclaracionViaje> findByFolio(String folio);
    List<DeclaracionViaje> findByDocumentoTitular(String documentoTitular);
    long countByEstado(EstadoDeclaracion estado);
    long countByPasoFronterizo(String pasoFronterizo);
}
