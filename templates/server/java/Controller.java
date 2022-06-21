
package <%=data.packageName%>.controller;

import <%=data.packageName%>.dto.*;
import <%=data.packageName%>.service.*;


import com.simple.common.api.*;
import com.simple.common.controller.BaseController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@AllArgsConstructor
@RestController
@Api(tags = "<%=data.moduleClassName%>接口")
@RequestMapping("/<%=data.moduleName%>")
public class <%=data.moduleClassName%>Controller extends BaseController {

    private final <%=data.moduleClassName%>Service service;


    @ApiOperation(value="查询全部简单数据项")
    @GetMapping(path = "/queryAll")
    public SimpleResponse<<%=data.moduleClassName%>sDto> queryAll(){

        List<<%=data.moduleClassName%>Dto> list = service.findAll();
        SimpleResponse<<%=data.moduleClassName%>sDto> result = new SimpleResponse<<%=data.moduleClassName%>sDto>();

        return result.success(<%=data.moduleClassName%>sDto.builder().items(list).build());
    }

    @ApiOperation(value="查询全部详细数据项")
    @GetMapping(path = "/queryAllDetails")
    public SimpleResponse<<%=data.moduleClassName%>DetailsDto> queryAllDetails(){

        List<<%=data.moduleClassName%>DetailDto> list = service.findAllDetails();
        SimpleResponse<<%=data.moduleClassName%>DetailsDto> result = new SimpleResponse<<%=data.moduleClassName%>DetailsDto>();

        return result.success(<%=data.moduleClassName%>DetailsDto.builder().items(list).build());
    }

    @ApiOperation(value="根据ID获取详细的全量信息",notes = "")
    @PostMapping(path = "/findById")
    public SimpleResponse<<%=data.moduleClassName%>DetailDto> findDetailById (@RequestBody IdRequest request){
        Long id = request.getParams().getId();
        System.out.println("applicationId:" + id);
        <%=data.moduleClassName%>DetailDto dto = service.findDetailById(id);
        SimpleResponse<<%=data.moduleClassName%>DetailDto> result = new SimpleResponse<<%=data.moduleClassName%>DetailDto>();
        return result.success(dto);
    }

    @ApiOperation(value="新增",notes = "")
    @PostMapping(path = "/addNew")
    public SimpleResponse<<%=data.moduleDtoClassName%>> addNew (@RequestBody SimpleRequest<<%=data.moduleClassName%>NewDto> request){
        <%=data.moduleClassName%>NewDto dto = request.getParams();
        <%=data.moduleDtoClassName%> data = service.save(dto);
        SimpleResponse<<%=data.moduleDtoClassName%>> result = new SimpleResponse<<%=data.moduleDtoClassName%>>();
        return result.success(data);
    }


    @ApiOperation(value="修改信息",notes = "")
    @PostMapping(path = "/update")
    public SimpleResponse<<%=data.moduleDtoClassName%>> updateSave(@RequestBody SimpleRequest<<%=data.moduleDtoClassName%>> req) {
        <%=data.moduleDtoClassName%> dto = req.getParams();
        System.out.println(dto.toString());
        service.update(dto);
        SimpleResponse<<%=data.moduleDtoClassName%>> result = new SimpleResponse<<%=data.moduleDtoClassName%>>();
        return result.success(dto);

    }



    @ApiOperation(value="根据ID删除",notes = "")
    @ResponseBody
    @RequestMapping(value = "/removeById", method = RequestMethod.POST)
    public IdResponse doRemoveById(@RequestBody IdRequest req) {
        service.remove(req.getParams().getId());
        return IdResponse.buildSuccess(req.getId());
    }


    @ApiOperation(value="批量删除",notes = "")
    @ResponseBody
    @RequestMapping(value = "/removeBatch", method = RequestMethod.POST)
    public BatchIdsResponse removeBatch(@RequestBody BatchIdsRequest req) {
        System.out.println(req.getIds().toString());
        service.removeBatch(req.getIds());
        return BatchIdsResponse.buildSuccess(req.getIds());
    }



}
