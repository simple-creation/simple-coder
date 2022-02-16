package <%=data.packageName%>.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import <%=data.packageName%>.entity.*;
import <%=data.packageName%>.service.*;


//import io.swagger.annotations.ApiImplicitParam;
//import io.swagger.annotations.ApiOperation;

@Controller
@RequestMapping("/<%=data.originModuleName%>")
public class <%=data.moduleName%>Controller {
	@Autowired
	<%=data.moduleName%>Service service;

  <% for (var field in data.moduleDefine){
                var fieldDef  = data.moduleDefine[field];
                var fieldName = fieldDef.dName;
                var keyName = field;

                var refer = fieldDef.refer;
                if (refer) {
                var clsName = data.firstUpper(refer.module);
                %>
   @Autowired
   private  <%=clsName%>Service <%=refer.module%>Service;
   <%}}%>


	@RequestMapping(value= "/", method=RequestMethod.GET)
    public String rootpage(){
    	       return "index";
    }
	@RequestMapping(value = "/queryAll", method = RequestMethod.GET)
	@ResponseBody
	public List<<%=data.moduleName%>> findAll() {
		return service.findAll();
	}
	@ResponseBody
    @RequestMapping(value = "/query/{id}", method = RequestMethod.GET)
    public <%=data.moduleName%> findById(@PathVariable Long id) {
       	System.out.println("input param Id:" + id);
       	<%=data.moduleName%> result = service.findById(id);
    	return result;
    }
    @ResponseBody
    @RequestMapping(value = "/queryByNameLike/", method = RequestMethod.GET)
    public List<<%=data.moduleName%>> findByNameLike(@RequestParam("name") String name ) {
           	System.out.println("input param Name:" + name);
            return service.findByNameLike(name);

    }

    @ResponseBody
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public <%=data.moduleName%> save(@RequestBody <%=data.moduleName%> item) {
		System.out.println("input device params:" + item.toString());
		<%=data.moduleName%> result = service.save(item);
		System.out.println("output device result data:" + result.toString());
		return result;
	}
    @ResponseBody
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public <%=data.moduleName%> save2(@RequestBody <%=data.moduleName%> item) {
		 <% for (var field in data.moduleDefine){
                                   var fieldDef  = data.moduleDefine[field];
                                   var fieldName = fieldDef.dName;
                                   var keyName = field;

                                   var refer = fieldDef.refer;
                                   if (refer) {
                                   var clsName = data.firstUpper(refer.module);
                                   var fieldNameUpper = data.firstUpper(field);
                                   var idType = data.moduleDefine['id'].type;
         %>
                   <%=idType%> <%=field%>Id =item.get<%=fieldNameUpper%>().getId();
                   if (<%=field%>Id > 0){
                   	  <%=clsName%> <%=field%>Obj = <%=refer.module%>Service.findById(<%=field%>Id);
                      item.set<%=fieldNameUpper%>(<%=field%>Obj);
                   }

         <%}}%>

		System.out.println("input device params:" + item.toString());
		<%=data.moduleName%> result = service.save(item);
		System.out.println("output device result data:" + result.toString());
		return result;
	}


    @ResponseBody
 	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
 	public <%=data.moduleName%> update(@PathVariable Long id, @RequestBody <%=data.moduleName%> item) {
 		System.out.println("input device params:" + item.toString());
 		<%=data.moduleName%> result = service.save(item);
 		System.out.println("output device result data:" + result.toString());
 		return result;
 	}

 	@ResponseBody
     	@RequestMapping(value = "/update/{id}", method = RequestMethod.POST)
     	public <%=data.moduleName%> updateSave(@PathVariable Long id, @RequestBody <%=data.moduleName%> item) {
     	   <% for (var field in data.moduleDefine){
                           var fieldDef  = data.moduleDefine[field];
                           var fieldName = fieldDef.dName;
                           var keyName = field;

                           var refer = fieldDef.refer;
                           if (refer) {
                           var clsName = data.firstUpper(refer.module);
                           var fieldNameUpper = data.firstUpper(field);
                           var idType = data.moduleDefine['id'].type;
           %>
           <%=idType%> <%=field%>Id =item.get<%=fieldNameUpper%>().getId();
           if (<%=field%>Id > 0){
           	  <%=clsName%> <%=field%>Obj = <%=refer.module%>Service.findById(<%=field%>Id);
              item.set<%=fieldNameUpper%>(<%=field%>Obj);
           }

           <%}}%>



     		System.out.println("input device params:" + item.toString());
     		<%=data.moduleName%> result = service.save(item);
     		System.out.println("output device result data:" + result.toString());
     		return result;
     	}



    @ResponseBody
   	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
   	public Long remove(@PathVariable Long id) {
		service.remove(id);
        return id;
    }
    @ResponseBody
    @RequestMapping(value = "/remove/{id}", method = RequestMethod.POST)
    public Long removeById(@PathVariable Long id) {
    	service.remove(id);
    	return id;
    }




    <%if (data.moduleName=='Dictionary'){%>
    @ResponseBody
    @RequestMapping(value = "/queryByCategory/", method = RequestMethod.GET)
    public List<Dictionary> findByParams(@RequestParam("category") String category) {
           	System.out.println("input param category:" + category);
            Category citem  = categoryService.findOneByName(category);
           	List<Dictionary> result = service.findByCategory(citem);
        	return result;
    }
   <%}%>

}