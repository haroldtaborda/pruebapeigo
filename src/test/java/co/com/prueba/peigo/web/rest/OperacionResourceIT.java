package co.com.prueba.peigo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

import javax.persistence.EntityManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import co.com.prueba.peigo.IntegrationTest;
import co.com.prueba.peigo.domain.Operacion;
import co.com.prueba.peigo.repository.OperacionRepository;
import co.com.prueba.peigo.service.dto.OperacionDTO;
import co.com.prueba.peigo.service.mapper.OperacionMapper;

/**
 * Integration tests for the {@link OperacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OperacionResourceIT {

    private static final String DEFAULT_NUMERO_OPERACION = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_OPERACION = "BBBBBBBBBB";

    private static final Double DEFAULT_MONTO = 1D;
    private static final Double UPDATED_MONTO = 2D;

    private static final String DEFAULT_CUENTA_ORIGEN = "123456";
    private static final String UPDATED_CUENTA_ORIGEN = "1234567";

    private static final String DEFAULT_CUENTA_DESTINO = "1234";
    private static final String UPDATED_CUENTA_DESTINO = "123";

    private static final String ENTITY_API_URL = "/api/operacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OperacionRepository operacionRepository;

    @Autowired
    private OperacionMapper operacionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOperacionMockMvc;

    private Operacion operacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operacion createEntity(EntityManager em) {
        Operacion operacion = new Operacion();
        operacion.setNumeroOperacion(DEFAULT_NUMERO_OPERACION);
        operacion.setMonto(DEFAULT_MONTO);
        operacion.setCuentaOrigen(DEFAULT_CUENTA_ORIGEN);
        operacion.setCuentaDestino(DEFAULT_CUENTA_DESTINO);
        return operacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operacion createUpdatedEntity(EntityManager em) {
        Operacion operacion = new Operacion();
        		  operacion.setNumeroOperacion(DEFAULT_NUMERO_OPERACION);
        operacion.setMonto(DEFAULT_MONTO);
        operacion.setCuentaOrigen(DEFAULT_CUENTA_ORIGEN);
        operacion.setCuentaDestino(DEFAULT_CUENTA_DESTINO);
        return operacion;
    }

    @BeforeEach
    public void initTest() {
        operacion = createEntity(em);
    }

    @Test
    @Transactional
    void createOperacion() throws Exception {
        int databaseSizeBeforeCreate = operacionRepository.findAll().size();
        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);
        restOperacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(operacionDTO)))
            .andExpect(status().isCreated());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeCreate + 1);
        Operacion testOperacion = operacionList.get(operacionList.size() - 1);
        assertThat(testOperacion.getNumeroOperacion()).isEqualTo(DEFAULT_NUMERO_OPERACION);
        assertThat(testOperacion.getMonto()).isEqualTo(DEFAULT_MONTO);
        assertThat(testOperacion.getCuentaOrigen()).isEqualTo(DEFAULT_CUENTA_ORIGEN);
        assertThat(testOperacion.getCuentaDestino()).isEqualTo(DEFAULT_CUENTA_DESTINO);
    }

    @Test
    @Transactional
    void createOperacionWithExistingId() throws Exception {
        // Create the Operacion with an existing ID
        operacion.setId(1L);
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        int databaseSizeBeforeCreate = operacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOperacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(operacionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOperacions() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        // Get all the operacionList
        restOperacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(operacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroOperacion").value(hasItem(DEFAULT_NUMERO_OPERACION)))
            .andExpect(jsonPath("$.[*].monto").value(hasItem(DEFAULT_MONTO.doubleValue())))
            .andExpect(jsonPath("$.[*].cuentaOrigen").value(hasItem(DEFAULT_CUENTA_ORIGEN)))
            .andExpect(jsonPath("$.[*].cuentaDestino").value(hasItem(DEFAULT_CUENTA_DESTINO)));
    }

    @Test
    @Transactional
    void getOperacion() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        // Get the operacion
        restOperacionMockMvc
            .perform(get(ENTITY_API_URL_ID, operacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(operacion.getId().intValue()))
            .andExpect(jsonPath("$.numeroOperacion").value(DEFAULT_NUMERO_OPERACION))
            .andExpect(jsonPath("$.monto").value(DEFAULT_MONTO.doubleValue()))
            .andExpect(jsonPath("$.cuentaOrigen").value(DEFAULT_CUENTA_ORIGEN))
            .andExpect(jsonPath("$.cuentaDestino").value(DEFAULT_CUENTA_DESTINO));
    }

    @Test
    @Transactional
    void getNonExistingOperacion() throws Exception {
        // Get the operacion
        restOperacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOperacion() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();

        // Update the operacion
        Operacion updatedOperacion = operacionRepository.findById(operacion.getId()).get();
        // Disconnect from session so that the updates on updatedOperacion are not directly saved in db
        em.detach(updatedOperacion);
        updatedOperacion.setNumeroOperacion(DEFAULT_NUMERO_OPERACION);
        updatedOperacion.setMonto(DEFAULT_MONTO);
        updatedOperacion.setCuentaOrigen(DEFAULT_CUENTA_ORIGEN);
        updatedOperacion.setCuentaDestino(DEFAULT_CUENTA_DESTINO);
        OperacionDTO operacionDTO = operacionMapper.toDto(updatedOperacion);

        restOperacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, operacionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isOk());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
        Operacion testOperacion = operacionList.get(operacionList.size() - 1);
        assertThat(testOperacion.getNumeroOperacion()).isEqualTo(UPDATED_NUMERO_OPERACION);
        assertThat(testOperacion.getMonto()).isEqualTo(UPDATED_MONTO);
        assertThat(testOperacion.getCuentaOrigen()).isEqualTo(UPDATED_CUENTA_ORIGEN);
        assertThat(testOperacion.getCuentaDestino()).isEqualTo(UPDATED_CUENTA_DESTINO);
    }

    @Test
    @Transactional
    void putNonExistingOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, operacionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(operacionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOperacionWithPatch() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();

        // Update the operacion using partial update
        Operacion partialUpdatedOperacion = new Operacion();
        partialUpdatedOperacion.setId(operacion.getId());

        partialUpdatedOperacion.setCuentaOrigen(UPDATED_CUENTA_ORIGEN);

        restOperacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOperacion))
            )
            .andExpect(status().isOk());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
        Operacion testOperacion = operacionList.get(operacionList.size() - 1);
        assertThat(testOperacion.getNumeroOperacion()).isEqualTo(DEFAULT_NUMERO_OPERACION);
        assertThat(testOperacion.getMonto()).isEqualTo(DEFAULT_MONTO);
        assertThat(testOperacion.getCuentaOrigen()).isEqualTo(UPDATED_CUENTA_ORIGEN);
        assertThat(testOperacion.getCuentaDestino()).isEqualTo(DEFAULT_CUENTA_DESTINO);
    }

    @Test
    @Transactional
    void fullUpdateOperacionWithPatch() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();

        // Update the operacion using partial update
        Operacion partialUpdatedOperacion = new Operacion();
        partialUpdatedOperacion.setId(operacion.getId());

        partialUpdatedOperacion.setNumeroOperacion(DEFAULT_NUMERO_OPERACION);
        partialUpdatedOperacion.setMonto(DEFAULT_MONTO);
        partialUpdatedOperacion.setCuentaOrigen(DEFAULT_CUENTA_ORIGEN);
        partialUpdatedOperacion.setCuentaDestino(DEFAULT_CUENTA_DESTINO);

        restOperacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOperacion))
            )
            .andExpect(status().isOk());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
        Operacion testOperacion = operacionList.get(operacionList.size() - 1);
        assertThat(testOperacion.getNumeroOperacion()).isEqualTo(UPDATED_NUMERO_OPERACION);
        assertThat(testOperacion.getMonto()).isEqualTo(UPDATED_MONTO);
        assertThat(testOperacion.getCuentaOrigen()).isEqualTo(UPDATED_CUENTA_ORIGEN);
        assertThat(testOperacion.getCuentaDestino()).isEqualTo(UPDATED_CUENTA_DESTINO);
    }

    @Test
    @Transactional
    void patchNonExistingOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, operacionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOperacion() throws Exception {
        int databaseSizeBeforeUpdate = operacionRepository.findAll().size();
        operacion.setId(count.incrementAndGet());

        // Create the Operacion
        OperacionDTO operacionDTO = operacionMapper.toDto(operacion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperacionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(operacionDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operacion in the database
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOperacion() throws Exception {
        // Initialize the database
        operacionRepository.saveAndFlush(operacion);

        int databaseSizeBeforeDelete = operacionRepository.findAll().size();

        // Delete the operacion
        restOperacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, operacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Operacion> operacionList = operacionRepository.findAll();
        assertThat(operacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
