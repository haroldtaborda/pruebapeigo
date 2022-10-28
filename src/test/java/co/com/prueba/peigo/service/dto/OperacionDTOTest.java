package co.com.prueba.peigo.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import co.com.prueba.peigo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OperacionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OperacionDTO.class);
        OperacionDTO operacionDTO1 = new OperacionDTO();
        operacionDTO1.setId(1L);
        OperacionDTO operacionDTO2 = new OperacionDTO();
        assertThat(operacionDTO1).isNotEqualTo(operacionDTO2);
        operacionDTO2.setId(operacionDTO1.getId());
        assertThat(operacionDTO1).isEqualTo(operacionDTO2);
        operacionDTO2.setId(2L);
        assertThat(operacionDTO1).isNotEqualTo(operacionDTO2);
        operacionDTO1.setId(null);
        assertThat(operacionDTO1).isNotEqualTo(operacionDTO2);
    }
}
