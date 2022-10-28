package co.com.prueba.peigo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.com.prueba.peigo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OperacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Operacion.class);
        Operacion operacion1 = new Operacion();
        operacion1.setId(1L);
        Operacion operacion2 = new Operacion();
        operacion2.setId(operacion1.getId());
        assertThat(operacion1).isEqualTo(operacion2);
        operacion2.setId(2L);
        assertThat(operacion1).isNotEqualTo(operacion2);
        operacion1.setId(null);
        assertThat(operacion1).isNotEqualTo(operacion2);
    }
}
