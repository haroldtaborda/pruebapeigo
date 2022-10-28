package co.com.prueba.peigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.com.prueba.peigo.domain.Trazabilidad;

/**
 * Spring Data SQL repository for the Cuenta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrazabilidadRepository extends JpaRepository<Trazabilidad, Long> {}
