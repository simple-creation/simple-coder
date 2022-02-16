package <%=data.packageName%>.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import <%=data.packageName%>.dao.*;
import <%=data.packageName%>.entity.*;


@Service
public class <%=data.moduleName%>Service {
	@Autowired
	<%=data.moduleName%>Repository dao;
	public List<<%=data.moduleName%>> findAll(){
		return  dao.findAll();
		//return items;
	}
	public  List<<%=data.moduleName%>> findByName(String name){
		return dao.findByName(name);
	}
	public  List<<%=data.moduleName%>> findByNameLike(String name){
    		return dao.findByNameLike(name);
    }

	public  <%=data.moduleName%> findOneByName(String name){
    		return dao.findOneByName(name);
    	}

	public <%=data.moduleName%> findById(Long id){
		return dao.findOne(id);
	}
	public <%=data.moduleName%> save(<%=data.moduleName%> item){
		return this.dao.save(item);
	}
	public void remove(Long id){
		this.dao.delete(id);
	}
	<%if(data.moduleName=='Dictionary'){%>
	public  List<<%=data.moduleName%>> findByCategory(Category category){
		return dao.findByCategory(category);
	}
	<%}%>
}
