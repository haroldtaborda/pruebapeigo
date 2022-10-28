package co.com.prueba.peigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.prueba.peigo.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
