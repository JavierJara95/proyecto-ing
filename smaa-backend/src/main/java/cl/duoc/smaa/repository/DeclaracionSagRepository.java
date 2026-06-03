package cl.duoc.smaa.repository;
import cl.duoc.smaa.model.DeclaracionSag;
import cl.duoc.smaa.model.EstadoRevisionSag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DeclaracionSagRepository extends JpaRepository<DeclaracionSag, Long> {
    List<DeclaracionSag> findByDeclaracionViajeId(Long idDeclaracion);
    boolean existsByDeclaracionViajeIdAndEstadoRevision(Long idDeclaracion, EstadoRevisionSag estadoRevision);
}
