const onFormSubmit = async (values, step) => {
  setUploading(true) // Establecer el estado uploading a true cuando comienza la subida

  try {
    if (
      step === 0 &&
      (!values.nombre || !values.ubicacion || !values.precio)
    ) {
      throw new Error('Por favor, completa todos los campos obligatorios.')
    }

    formData = {
      ...formData,
      status: 'activa',
      ...values,
      youtubeUrl,
      ubicacion: selectedLocation?.display_name,
    }

    if (step === 0) {
      formData.tipoPropiedad = values.tipoPropiedad || ''
      formData.condicion = values.condicion || ''
    }

    if (step === 3) {
      if (typeof app !== 'undefined') {
        if (
          values.fotos &&
          values.fotos.fileList &&
          values.fotos.fileList.length > 0
        ) {
          const imageId = Date.now().toString()

          const uploadTasks = values.fotos.fileList.map(
            async (photo, index) => {
              const storageRef = ref(
                storage,
                `propiedades/${imageId}_${index}`,
              )
              await uploadBytes(storageRef, photo.originFileObj)

              const imageURL = await getDownloadURL(storageRef)

              return imageURL
            },
          )

          const imageUrls = await Promise.all(uploadTasks)

          formData = { ...formData, fotos: imageUrls, youtubeUrl }
          formData = { ...formData, cardsActivadas }

          const propiedadesCollection = collection(firestore, 'propiedades')
          await addDoc(propiedadesCollection, formData)

          notification.success({
            message: 'Propiedad guardada',
            description: 'La propiedad ha sido guardada con éxito.',
          })

          setIsModalVisible(false)
        } else {
          throw new Error(
            'Por favor, selecciona al menos una foto para la propiedad.',
          )
        }
      } else {
        throw new Error('Firebase no está definido')
      }
    } else {
      nextStep()
    }
  } catch (error) {
    console.error('Error al guardar en Firebase:', error)
    notification.error({
      message: 'Error al guardar en Firebase',
      description:
        error.message || 'Ocurrió un error al intentar guardar la propiedad.',
    })
  } finally {
    setLoading(false)
    setUploading(false) // Establecer el estado uploading a false en cualquier caso
  }
}

const handleAdd = () => {
  form.resetFields()
  setFileList([])
  setIsModalVisible(true)
}

const handleEditarPropiedad = (key) => {
  form.setFieldsValue(dataSource.find((property) => property.key === key))
  setIsModalVisible(true)
}

const columns = [
  {
    title: 'Imagen',
    dataIndex: 'fotos',
    key: 'imagen',
    render: (fotos) => (
      <img
        src={fotos && fotos.length > 0 ? fotos[0] : ''}
        alt='Propiedad'
        style={{ width: '100px', height: '100Itzpx', objectFit: 'cover' }}
      />
    ),
  },
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Tipo de Propiedad',
    dataIndex: 'tipoPropiedad',
    key: 'tipoPropiedad',
    filters: [
      { text: 'Casa', value: 'Casa' },
      { text: 'Departamento', value: 'Departamento' },
      { text: 'Terreno', value: 'Terreno' },
      { text: 'Edificio', value: 'Edificio' },
      { text: 'Oficina', value: 'Oficina' },
      { text: 'Bodega', value: 'Bodega' },
      { text: 'Local', value: 'Local' },
    ],
    onFilter: (value, record) => record.tipoPropiedad === value,
  },
  {
    title: 'Condición',
    dataIndex: 'condicion',
    key: 'condicion',
    filters: [
      { text: 'Venta', value: 'Venta' },
      { text: 'Renta', value: 'Renta' },
    ],
    onFilter: (value, record) => record.condicion === value,
  },
  {
    title: 'Ubicación',
    dataIndex: 'ubicacion',
    key: 'ubicacion',
  },
  {
    title: 'Precio',
    dataIndex: 'precio',
    key: 'precio',
    render: (precio) => <>${precio.toLocaleString()}</>,
    sorter: (a, b) => a.precio - b.precio,
    sortDirections: ['ascend', 'descend'],
  },

  {
    title: 'Acciones',
    dataIndex: 'acciones',
    key: 'acciones',
    render: (text, record) => (
      <Space size='middle'>
        <Button
          type='primary'
          onClick={() => handleEditarPropiedad(record.key)}
          icon={<EditOutlined />}
        />
        <Button
          danger
          onClick={() => handleEliminarPropiedad(record.key)}
          icon={<DeleteOutlined />}
        />
        <Button onClick={() => handleDestacarPropiedad(record.key)}>
          <FontAwesomeIcon
            icon={record.highlighted ? solidStar : regularStar}
            style={{ color: record.highlighted ? 'gold' : 'gray' }}
          />
        </Button>
        <Button
          type={!isPropertyPaused(record) ? 'primary' : 'default'}
          icon={
            !isPropertyPaused(record) ? (
              <PlayCircleOutlined />
            ) : (
              <PauseCircleOutlined />
            )
          }
          onClick={() => {
            if (!isPropertyPaused(record)) {
              handlePauseProperty(record.key)
            } else {
              handleResumeProperty(record.key)
            }
          }}
          style={{
            backgroundColor: !isPropertyPaused(record)
              ? '#52c41a'
              : '#f0f0f0',
          }}
        />

        <Button
          onClick={() =>
            handleCopiarEnlace(
              `https://sandar-inmuebles.web.app/property/${record.key}`,
            )
          }>
          <CopyOutlined />
        </Button>
      </Space>
    ),
  },
]

return (
  <div>
<h1>Propiedades</h1>
<Space direction='vertical'>
  <Button type='primary' onClick={handleAdd}>
    Añadir propiedad
  </Button>
  <Input.Search
    placeholder='Buscar propiedad'
    allowClear
    enterButton={<SearchOutlined />}
    onSearch={handleSearch}
    onChange={(e) => {
      if (e.target.value === '') {
        setSearchTerm('')
      }
    }}
  />
</Space>
<Table dataSource={dataSource} columns={columns} />
<Modal
  title='Añadir Propiedad'
  visible={isModalVisible}
  onOk={form.submit}
  onCancel={() => setIsModalVisible(false)}
  width={800}
  style={{ minWidth: '800px' }}
  footer={[
    <Button
      key='back'
      onClick={() => {
        return (
          setIsModalVisible(false),
          form.resetFields(),
          setFileList([]),
          setCurrentStep(0)
        )
      }}>
      Cancelar
    </Button>,
    <Button
      key='submit'
      type='primary'
      loading={uploading}
      onClick={form.submit}>
      Guardar
    </Button>,
  ]}>
  <Steps current={currentStep} style={{ marginBottom: '20px' }}>
    <Step title='Información Básica' />
    <Step title='Descripción' />
    <Step title='Características' />
    <Step title='Fotos' />
  </Steps>

  <Form
    form={form}
    layout='vertical'
    onFinish={(values) => onFormSubmit(values, currentStep)}>
    {currentStep === 0 && (
      <>
        <Form.Item
          label='Nombre'
          name='nombre'
          rules={[
            { required: true, message: 'Por favor ingresa el nombre' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Tipo de Propiedad'
          name='tipoPropiedad'
          rules={[
            {
              required: true,
              message: 'Por favor selecciona el tipo de propiedad',
            },
          ]}>
          <Select>
            <Select.Option value='Casa'>Casa</Select.Option>
            <Select.Option value='Departamento'>
              Departamento
            </Select.Option>
            <Select.Option value='Terreno'>Terreno</Select.Option>
            <Select.Option value='Despacho'>Despacho</Select.Option>
            <Select.Option value='Oficina'>Oficina</Select.Option>
            <Select.Option value='Bodega'>Bodega</Select.Option>
            <Select.Option value='Edificio'>Edificio</Select.Option>
            <Select.Option value='Rancho'>Rancho</Select.Option>
            <Select.Option value='Hectareas'>Hectareas</Select.Option>
            {/* Agrega más opciones según sea necesario */}
          </Select>
        </Form.Item>
        <Form.Item
          label='Condición'
          name='condicion'
          rules={[
            {
              required: true,
              message: 'Por favor selecciona la condición',
            },
          ]}>
          <Radio.Group>
            <Radio value='Venta'>Venta</Radio>
            <Radio value='Renta'>Renta</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Ubicación'
          name='ubicacion'
          rules={[
            { required: true, message: 'Por favor ingresa la ubicación' },
          ]}>
          <Input
            onChange={(e) => handleLocationChange(e.target.value)}
            value={selectedLocation ? selectedLocation.display_name : ''}
          />
        </Form.Item>

        {locationSuggestions.length > 0 && (
          <ul>
            {locationSuggestions.map((suggestion) => (
              <li
                key={suggestion.display_name}
                onClick={() => handleLocationSelect(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        <Form.Item
          label='Precio'
          name='precio'
          rules={[
            { required: true, message: 'Por favor ingresa el precio' },
          ]}>
          <InputNumber
            min={0}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '50%' }} // Establecer el ancho del campo de entrada
          />
        </Form.Item>

        <Form.Item
          label='Ubicación en Mapa'
          style={{ height: mapHeight }}>
          <div
            style={{
              position: 'relative',
              height: mapHeight,
              marginBottom: '20px',
            }}>
            <Map
              height='300px'
              width='100%'
              markerCoords={markerCoords}
            />
          </div>
        </Form.Item>
      </>
    )}

    {currentStep === 1 && (
      <>
        <Form.Item label='Descripción' name='descripcion'>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label='Características adicionales'
          name='caracteristicas'>
          <Input />
        </Form.Item>
      </>
    )}

    {currentStep === 2 && (
      <>
        <Divider>Características</Divider>
        {Object.entries(sections).map(
          ([section, featuresInSection], sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px', color: '#1890ff' }}>
                {section}
              </h3>
              <Row gutter={16}>
                {featuresInSection.map((feature, featureIndex) => (
                  <Col
                    span={8}
                    key={featureIndex}
                    style={{ marginBottom: '10px' }}>
                    <Card
                      hoverable
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '10px',
                        border: featuresChecked[feature]
                          ? '2px solid #1890ff'
                          : '1px solid #d9d9d9',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleFeatureCheck(feature)}>
                      {/* Agrega iconos según sea necesario */}
                      {feature === 'Baño' && (
                        <FontAwesomeIcon
                          icon={faBath}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Medio Baño' && (
                        <FontAwesomeIcon
                          icon={faToilet}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Habitaciones' && (
                        <FontAwesomeIcon
                          icon={faBed}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Jardín' && (
                        <FontAwesomeIcon
                          icon={faTree}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Cocina' && (
                        <FontAwesomeIcon
                          icon={faUtensils}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Terraza' && (
                        <FontAwesomeIcon
                          icon={faHouseFlag}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Ático' && (
                        <FontAwesomeIcon
                          icon={faMountain}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Cochera' && (
                        <FontAwesomeIcon
                          icon={faCar}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Estacionamiento' && (
                        <FontAwesomeIcon
                          icon={faParking}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Alarma' && (
                        <FontAwesomeIcon
                          icon={faBell}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Cámaras de seguridad' && (
                        <FontAwesomeIcon
                          icon={faVideo}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Sistema de sonido' && (
                        <FontAwesomeIcon
                          icon={faVolumeUp}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Bodega' && (
                        <FontAwesomeIcon
                          icon={faBox}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Vestidor' && (
                        <FontAwesomeIcon
                          icon={faTshirt}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Chimenea' && (
                        <FontAwesomeIcon
                          icon={faFire}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Aire acondicionado' && (
                        <FontAwesomeIcon
                          icon={faSnowflake}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Amueblado' && (
                        <FontAwesomeIcon
                          icon={faCouch}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Mascotas permitidas' && (
                        <FontAwesomeIcon
                          icon={faPaw}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Vista panorámica' && (
                        <FontAwesomeIcon
                          icon={faBinoculars}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Gimnasio' && (
                        <FontAwesomeIcon
                          icon={faDumbbell}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Piscina' && (
                        <FontAwesomeIcon
                          icon={faSwimmingPool}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Salón de eventos' && (
                        <FontAwesomeIcon
                          icon={faGlassCheers}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Área de juegos' && (
                        <FontAwesomeIcon
                          icon={faChess}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Vista al mar' && (
                        <FontAwesomeIcon
                          icon={faWater}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Vista a la montaña' && (
                        <FontAwesomeIcon
                          icon={faMountain}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}
                      {feature === 'Vista a la ciudad' && (
                        <FontAwesomeIcon
                          icon={faCity}
                          size='2x'
                          color={
                            featuresChecked[feature] ? '#1890ff' : '#000'
                          }
                        />
                      )}

                      <p
                        style={{
                          marginTop: '5px',
                          textAlign: 'center',
                          fontSize: '14px',
                        }}>
                        {feature}
                      </p>
                    </Card>
                    {feature === 'Habitaciones' && (
                      <Form.Item
                        name='habitaciones'
                        initialValue={0}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value || value === 0) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                'Ingresa el número de habitaciones',
                              )
                            },
                          },
                        ]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          placeholder='Número de habitaciones'
                          disabled={!featuresChecked[feature]}
                        />
                      </Form.Item>
                    )}

                    {feature === 'Baño' && (
                      <Form.Item
                        name='baños'
                        initialValue={0}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value || value === 0) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                'Ingresa el número de baños',
                              )
                            },
                          },
                        ]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          placeholder='Número de baños'
                          disabled={!featuresChecked[feature]}
                        />
                      </Form.Item>
                    )}

                    {feature === 'Medio Baño' && (
                      <Form.Item
                        name='medioBaño'
                        initialValue={0}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value || value === 0) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                'Ingresa el número de Medio Baño',
                              )
                            },
                          },
                        ]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          placeholder='Número de Medio Baño'
                          disabled={!featuresChecked[feature]}
                        />
                      </Form.Item>
                    )}

                    {feature === 'Estacionamiento' && (
                      <Form.Item
                        name='estacionamiento'
                        initialValue={0}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value || value === 0) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                'Ingresa el número de Estacionamientos',
                              )
                            },
                          },
                        ]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          placeholder='Número de Estacionamientos'
                          disabled={!featuresChecked[feature]}
                        />
                      </Form.Item>
                    )}
                  </Col>
                ))}
              </Row>
            </div>
          ),
        )}

        <Divider>Tamaño y Construcción</Divider>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Form.Item
              label='Tamaño de la Propiedad'
              name='tamanioPropiedad'
              rules={[
                {
                  required: true,
                  message: 'Ingresa el tamaño de la propiedad',
                },
              ]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <FontAwesomeIcon
              icon={faHome}
              style={{ fontSize: '16px', marginRight: '8px' }}
            />
          </Col>
          <Col span={12}>
            <Form.Item
              label='Metros Construidos'
              name='metrosConstruidos'
              rules={[
                {
                  required: true,
                  message: 'Ingresa los metros construidos',
                },
              ]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <FontAwesomeIcon
              icon={faRulerCombined}
              style={{ fontSize: '16px', marginRight: '8px' }}
            />
          </Col>
        </Row>
      </>
    )}

    {currentStep === 3 && (
      <>
        <Form.Item label='Fotos' name='fotos'>
          <Upload
            listType='picture-card'
            fileList={fileList}
            onChange={handleUploadChange}
            onPreview={onPreview}
            beforeUpload={() => false}>
            {fileList.length < 50 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Subir</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label='URL de YouTube' name='youtubeUrl'>
          <Input
            placeholder='Inserta la URL de YouTube'
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value)
            }}
          />
        </Form.Item>

        {youtubeUrl && (
          <YouTube
            videoId={getYouTubeVideoId(youtubeUrl)}
            opts={{ width: '100%', height: 315 }}
          />
        )}
      </>
    )}

    <Divider />

    {currentStep > 0 && (
      <Button style={{ margin: '0 8px' }} onClick={prevStep}>
        Anterior
      </Button>
    )}
  </Form>
</Modal>
    </div>

)


export default Propiedades