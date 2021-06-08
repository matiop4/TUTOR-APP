import React, { useState } from 'react';

const FilterSidebar = ({ setFilters }) => {
  const [tempFilters, setTempFilters] = useState({
    SearchString: '',
    Localization: '',
    SelectedTopics: '',
    RemoteLessons: false,
    LocalLessons: false,
  });

  const handleChange = ({ target: { value, name } }) => {
    setTempFilters({ ...tempFilters, [name]: value });
  };

  const handleCheckboxChange = ({ target: { checked, name } }) => {
    setTempFilters({ ...tempFilters, [name]: checked });
  };

  const handleSearch = () => {
    let tempObj = {
      ...tempFilters,
    };

    if (tempObj.SelectedTopics?.length > 0)
      tempObj.SelectedTopics = tempObj.SelectedTopics.split(' ');

    setFilters(tempObj);
  };

  return (
    <aside className='col-sm-3 pl-0 pt-2'>
      <div className='card'>
        <article className='card-group-item'>
          <header className='card-header'>
            <h6 className='title'>Szukaj korepetytora</h6>
          </header>
          <div className='filter-content'>
            <div className='card-body'>
              <form>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    name='SearchString'
                    placeholder='Nazwa korepetytora'
                    value={tempFilters.SearchString}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
          </div>
        </article>{' '}
        {/*  */}
        <article className='card-group-item'>
          <header className='card-header'>
            <h6 className='title'>Lokalizacja</h6>
          </header>
          <div className='filter-content'>
            <div className='card-body'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  name='Localization'
                  value={tempFilters.Localization}
                  placeholder='np. Warszawa'
                  onChange={handleChange}
                />
              </div>
            </div>{' '}
            {/* card-body.// */}
          </div>
        </article>{' '}
        {/*  */}
        <article className='card-group-item'>
          <header className='card-header'>
            <h6 className='title'>Przedmioty (po spacji)</h6>
          </header>
          <div className='filter-content'>
            <div className='card-body'>
              <div className='input-group'>
                <input
                  type='text'
                  name='SelectedTopics'
                  value={tempFilters.SelectedTopics}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='np. Fizyka Chemia Biologia'
                />
              </div>
            </div>{' '}
          </div>
        </article>{' '}
        {/*  */}
        <article className='card-group-item'>
          <header className='card-header'>
            <h6 className='title'>Dodatkowe filtry</h6>
          </header>
          <div className='filter-content'>
            <div className='card-body'>
              <label className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={tempFilters.RemoteLessons}
                  onChange={handleCheckboxChange}
                  name='RemoteLessons'
                  defaultValue
                />
                <span className='form-check-label'>Lekcje zdalne</span>
              </label>
              <label className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  onChange={handleCheckboxChange}
                  checked={tempFilters.LocalLessons}
                  name='LocalLessons'
                  defaultValue
                />
                <span className='form-check-label'>Lekcje na miejscu</span>
              </label>
            </div>{' '}
            {/* card-body.// */}
          </div>
        </article>{' '}
        <button
          className='btn btn-primary mx-2 mb-2 d-flex align-items-center justify-content-center'
          onClick={handleSearch}
        >
          <span>Szukaj</span> <i className='ml-2 fas fa-search' />
        </button>
        {/* card-group-item.// */}
      </div>{' '}
      {/* card.// */}
      {/* col.// */}
    </aside>
  );
};

export default FilterSidebar;
