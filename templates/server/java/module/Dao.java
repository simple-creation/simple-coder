package <%=data.packageName%>.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import <%=data.packageName%>.entity.*;

public interface <%=data.moduleName%>Repository extends JpaRepository<<%=data.moduleName%>, Long> {
    public  List<<%=data.moduleName%>> findByName(String name);
    public  List<<%=data.moduleName%>> findByNameLike(String name);

    public  <%=data.moduleName%> findOneByName(String name);

    <%if(data.moduleName=='Dictionary'){%>
	public  List<<%=data.moduleName%>> findByCategory(Category category);
    <%}%>
}
