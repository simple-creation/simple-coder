package <%=data.packageName%>.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import <%=data.packageName%>.model.*;
import java.util.List;

public interface <%=data.moduleClassName%>Repository extends JpaRepository<<%=data.modelClassName%>, Long> {
    
    @Modifying
    @Transactional
    @Query("delete from <%=data.modelClassName%> s where s.id in (?1)")
    public int deleteBatch(List<Long> ids);
    
}
