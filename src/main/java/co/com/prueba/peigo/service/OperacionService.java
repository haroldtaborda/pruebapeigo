package co.com.prueba.peigo.service;

import co.com.prueba.peigo.service.dto.OperacionDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link co.com.prueba.peigo.domain.Operacion}.
 */
public interface OperacionService {
    /**
     * Save a operacion.
     *
     * @param operacionDTO the entity to save.
     * @return the persisted entity.
     */
    OperacionDTO save(OperacionDTO operacionDTO);

    /**
     * Updates a operacion.
     *
     * @param operacionDTO the entity to update.
     * @return the persisted entity.
     */
    OperacionDTO update(OperacionDTO operacionDTO);

    /**
     * Partially updates a operacion.
     *
     * @param operacionDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OperacionDTO> partialUpdate(OperacionDTO operacionDTO);

    /**
     * Get all the operacions.
     *
     * @return the list of entities.
     */
    List<OperacionDTO> findAll();

    /**
     * Get the "id" operacion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OperacionDTO> findOne(Long id);

    /**
     * Delete the "id" operacion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
