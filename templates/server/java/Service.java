package <%=data.packageName%>.service;


import <%=data.packageName%>.dto.*;
import <%=data.packageName%>.model.*;
import <%=data.packageName%>.dao.*;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class <%=data.moduleClassName%>Service {
    private final ModelMapper modelMapper;


    private final <%=data.moduleClassName%>Repository dao;


    public <%=data.modelClassName%> convertToModel(<%=data.moduleDtoClassName%> dto){
        return this.modelMapper.map(dto, <%=data.modelClassName%>.class);
    }
    public List<<%=data.modelClassName%>> convertToModels(List<<%=data.moduleDtoClassName%>> dtos){
        List<<%=data.modelClassName%>> resultList = new ArrayList<<%=data.modelClassName%>>();
        for (int i=0; i < dtos.size(); i++){
            resultList.add(this.convertToModel(dtos.get(i)));
        }
        return resultList;
    }
    public <%=data.moduleDtoClassName%> convertToDto(<%=data.modelClassName%> model){

        return this.modelMapper.map(model, <%=data.moduleDtoClassName%>.class);
    }



    public List<<%=data.moduleDtoClassName%>> convertToDtos(List<<%=data.modelClassName%>> models){
        List<<%=data.moduleDtoClassName%>> resultList = new ArrayList<<%=data.moduleDtoClassName%>>();
        for (int i=0; i < models.size(); i++){
            resultList.add(this.convertToDto(models.get(i)));
        }
        return resultList;

    }


    public <%=data.moduleClassName%>DetailDto convertToDetailDto(<%=data.modelClassName%> model){
        if (null == model){return null;}
        <%=data.moduleClassName%>DetailDto detail =  this.modelMapper.map(model, <%=data.moduleClassName%>DetailDto.class);
        return detail;
    }

    public List<<%=data.moduleClassName%>DetailDto> convertToDetailDtos(List<<%=data.modelClassName%>> models){
        List<<%=data.moduleClassName%>DetailDto> resultList = new ArrayList<<%=data.moduleClassName%>DetailDto>();
        for (int i=0; i < models.size(); i++){
            resultList.add(this.convertToDetailDto(models.get(i)));
        }
        return resultList;

    }

    public List<<%=data.moduleDtoClassName%>> findAll(){

        List<<%=data.modelClassName%>> list =   dao.findAll();
        return  this.convertToDtos(list);
    }

	public List<<%=data.moduleClassName%>DetailDto> findAllDetails(){

        List<<%=data.modelClassName%>> list = dao.findAll();
        return  this.convertToDetailDtos(list);
    }


    public <%=data.moduleDtoClassName%> findById(Long id){
        <%=data.modelClassName%> model =  dao.findById(id).orElse(null);
        return this.convertToDto(model);
    }

	public <%=data.moduleClassName%>DetailDto findDetailById(Long id){
        <%=data.modelClassName%> model =  dao.findById(id).orElse(null);
        return this.convertToDetailDto(model);
    }

    public <%=data.moduleDtoClassName%> save(<%=data.moduleClassName%>NewDto item){
        <%=data.modelClassName%> model = this.modelMapper.map(item, <%=data.modelClassName%>.class);
        <%=data.modelClassName%> newModel = this.dao.save(model);
        return this.convertToDto(newModel);
    }

    public <%=data.moduleDtoClassName%> update(<%=data.moduleDtoClassName%> item){
        Long id = item.getId();
        <%=data.modelClassName%> model = dao.findById(id).orElse(null);
        if(null == model ){return null;}
        this.modelMapper.map(item, model);
        this.dao.save(model);
        return item;
    }

    public void remove(Long id){
        this.dao.deleteById(id);
    }
    public void  removeBatch(List<Long> ids) {
        try{
            int removeRows = this.dao.deleteBatch(ids);
            System.out.println("have remove rows number ==>"  + String.valueOf(removeRows));
        }catch (Exception e){
            e.printStackTrace();
        }

    }

}