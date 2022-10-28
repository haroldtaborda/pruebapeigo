package co.com.prueba.peigo.service;

import java.util.List;
import java.util.Optional;

import co.com.prueba.peigo.service.dto.CuentaDTO;

/**
 * Service Interface for managing {@link co.com.prueba.peigo.domain.Cuenta}.
 */
public interface CuentaService {
    /**
     * Save a cuenta.
     *
     * @param cuentaDTO the entity to save.
     * @return the persisted entity.
     */
    CuentaDTO save(CuentaDTO cuentaDTO);

    /**
     * Updates a cuenta.
     *
     * @param cuentaDTO the entity to update.
     * @return the persisted entity.
     */
    CuentaDTO update(CuentaDTO cuentaDTO);

    /**
     * Partially updates a cuenta.
     *
     * @param cuentaDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CuentaDTO> partialUpdate(CuentaDTO cuentaDTO);

    /**
     * Get all the cuentas.
     *
     * @return the list of entities.
     */
    List<CuentaDTO> findAll();

    /**
     * Get the "id" cuenta.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CuentaDTO> findOne(Long id);

    /**
     * Delete the "id" cuenta.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    
    Optional<CuentaDTO> findByNumber(String numeroCuenta);

	CuentaDTO cargarCuenta(CuentaDTO cuentaDTO, String operacion);

	List<CuentaDTO> consultarCuentasNumero(String numero, String usuario);
}
