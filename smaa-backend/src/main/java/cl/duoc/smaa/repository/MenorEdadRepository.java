package cl.duoc.smaa.repository;
import cl.duoc.smaa.model.MenorEdad;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MenorEdadRepository extends JpaRepository<MenorEdad, Long> {
    List<MenorEdad> findByDeclaracionViajeId(Long idDeclaracion);
}
