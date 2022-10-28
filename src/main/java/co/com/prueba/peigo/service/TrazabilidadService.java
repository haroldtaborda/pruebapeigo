package co.com.prueba.peigo.service;

import java.util.List;

import co.com.prueba.peigo.service.dto.TrazabilidadDTO;

/**
 * Service Interface for managing {@link co.com.prueba.peigo.domain.Operacion}.
 */
public interface TrazabilidadService {
    /**
     * Save a operacion.
     *
     * @param operacionDTO the entity to save.
     * @return the persisted entity.
     */
    TrazabilidadDTO save(TrazabilidadDTO trazabilidadDTO);

    
    /**
     * Get all the operacions.
     *
     * @return the list of entities.
     */
    List<TrazabilidadDTO> findAll();

  
}
