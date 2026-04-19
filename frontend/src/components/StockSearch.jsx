import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAUVBMVEX///9mZmZeXl5iYmJXV1daWlqlpaXBwcH8/Py0tLRubm6rq6vw8PCIiIiBgYHc3Nz29vbQ0NCfn590dHTj4+OQkJDq6upSUlKWlpbHx8e6urpx1ZffAAABmElEQVRIib2W65KDIAyFIQQvULRg1db3f9AFu91tazTQmd38ZOabE5KTgBB/GX3dfECdg9bzuZyrUUkJ5YoVyhimmLM6cepayvlVT2pfyDVq5coztbByWCoo7noQSrnLekNwpZy4pUz1WMyJBUHLupwTfbD5ZTnVYXTXZfo5aHrrBjM42x9hF4egYgAae0kHfgQNqZvqMGuL3x1PxURTBaV/D2Kdup0hcVq+hFLy7UCeKG4EyYUyxHy1muViDtsSTchz4AhB934hQo8y3zTzguR0WV4QSQsYPtGO4k58aYA0jud7gRMF1nzzgeJEy4PyU5BedRmg+hREcqZyikOukZ5vhyLXXYYBdhrJW3XHcxlTJXVLgEuGAyQSds1ZAJGstiQ/VynAbJqS49ZEbl71c1au1Bq4ZtSVtHpWefSN6MiYI0lwObYjBTMKS5suxsAki+RjlZI9Hi6kE03hj6657f3zNZ9JBc9PK+xd8B4WHxAOwYYOH485w6VfUYSBuavvhWh8iN8HgJmYiw0aKv/ygPaLbcm18b/xBf8tD08u8Xy+AAAAAElFTkSuQmCC' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAclBMVEX////lGDfjABjjAB7kACfkAC34z9PjABTkACHlFTX63uH86OrkACr87e/+9fbrZnTviZL0trvzrbTqXm3mKUPjAAnypazhAAD51Nf3ys7wkJn52dz2xMjoQ1bpUmPpTV/teYTnNUvugYvsbXnxnaXwlp+aqQXGAAAB0ElEQVRIie2W23KrIBRAuQtqBBWtifUWk///xW6g0zlzptLIa7seFIlLcGdvEKHfSSUaoxfLGeN20aYX1StSvdoucxAqJSW+2dm1vkStfulIRrZ7I4rPUapCNPcNOrupPxw4f6OEG4HQAFPVoU9r0wwICaMIfRuOzGkf4JYtk4xztrueVUJLdhYeN+7b8VwLwyRXGCulMH0g1FPfxIpLZorIS947uKukTFmscHYVGZysYrQEt1sjIrplit3co/sSxgKt7N1EnlJlJuZBFKx/N3SVbsIYy6u/XPE17gHhD7sQ7CGXfzpfAqYJKPy68cnMvTifFo0X+Q8h+YaaOZE1p8WROpEeZtkhlfTiKxX1H5tLNXveQztEh+sE8QEJWj4TxHd4SfmeIBaQdCRWSodwpXiKhxalpiTxzvmaJDaM9UniQKVIEitCEhLOYc9XcaA9X8WB2/kqDtTnqzgwpgUVwpoY1D9+FzUtJYNFZuBcMfhweErYkiHpcMifvVQcH+yveeuO1cUBtdHACSQbxCr0RsR8WZaphiVnnufNfIl8mqZsjIlF7nCXed47UYwjbHZuid0PNr3C7xSF1rqFpb9poQEjw9dZC/4KPz3yWJD++OIDvJEWr894l8gAAAAASUVORK5CYII=' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAgCAMAAABw3UvaAAAAhFBMVEX////U1NSlpaWgoKC2trZytACUlJScnJzFxcW/v7////38///0d13zRw75QxSly214uADy+Ov29faEhITe3t7Ozs79im/9ZDT/YDiu04aEwkB+vy95eXnm5uaurq6Ojo5mxPsrtfkZtP/+1Yv/wj7/vi//+u9RtvIAoe4Aoff5zHH/twAUhvfEAAAAkUlEQVQ4je3RyQoCMQwG4DSNbTquk+m4t+7jMu//fgoieJCCc1Lod8kh+UkgAFn2jwqA/rN8azAcjSe9snNQKvDRvTdMLcngdDZfLFelrENE5y1bpxUq0lxtKJUrtrv94XhqhCwjGlDegiFGwOjSG8+X661tG6lJiJTmwFpFRzqQT258BZMzH099gE7vyLKfdQd1TwfkokfDLgAAAABJRU5ErkJggg==' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAKCAMAAADW6m2KAAAAkFBMVEX///8AAABxtwB4ug12uQCw1In29vb5+flxcXE+Pj5TU1N1dXXl5eWsrKz8/PwmJibHx8fe3t5ksgDn8duQkJBHR0dkZGSCgoJpaWnu9uacnJyDvzErKytaWlparQCcy2W8vLzI4a7Q5bqo0XuMw0ba68r4+/WgzW232JSTx1UbGxsODg69253g7tLR0dGHwTvgSZLVAAABLklEQVQokZWSWXeCMBCF7wRN0BKW4BarsoiAden//3edCXpOH9v7MIGcfLPcBBB5p2aRSM3xD/XN/NEOzM5mAmoWZOGQ6tRoGK2NHAzR6PTFnbtLqaqy79QEZsRa6BXtgQ0lazIb2dmioB3D/Bmw0rV9NcB3Z5xVABdU51s6aloDlGFJacw7S9on9AHsaUu5gJ8DTr53aBwuTk0g98JpD5TmXDWACQwtA8jp6Cjg49RXY+9UhObUXCfQSL+cmwsnbxC0EDDncjHJ+BgjVMPY+mvkuf4vkM99HfAGLcUCHinLbrQKU97Vo7x+di36MbR6EPBGwSX2h83ZiTlUFBRr2hTPgsiEMf288v5y/3aTObVNJQBPa3X4za21tYa2z8Jy08htUb9ukm0JT+DvD+AHzoMTut4lohYAAAAASUVORK5CYII=' },
  { symbol: 'AMZN', name: 'Amazon.com', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAARCAMAAAC/+5/SAAAAn1BMVEX///8AEikAGC3/kQAACCQACyUAGi7CxMfp6uvz9PQWJTYAFive3+FjaXEAAB4aKDiKjpQhLT10eYAAACINHzLW19kAABgAAACprLCQlJlHT1krNkQAABU8RVG7vcCeoaVTWWP/yJP/iwD/0qr/uXP/tWqAhIsAAA4zPEnMzdBscXn/rVX/7t7/2bj/+PL/nR3/pDr/zZ7/5tH/mAD/wodfsIKZAAAB1UlEQVQokYWS6ZaiMBCFb2iWAGEPimAAQRFQXPv9n21KjqenZ6Z17uFHSNWXulUJwLs+qi1AxCvu5SWy3BMALK9QnQ1kYxzHY0bxUXkDYI8xxjykhWFGhbMeYCUqMiLWrWVgUL7PlJQFEO99GZgx0oXrsEUJ4QeeH7AK1TIHermCZcqVJSPNWjmGANtnSF2dw+Z25yQCSnbITBOcBV6qHI9K0lfLkMAE8ChsG4y8chD4WEDoWgWeuOkjknJGm5VZA0O9XzoOgZpLoBbC1h/5VbFcRzNYOORpcBkdlciMM4NT6RrD2sj4XHEGzSc4GmpItQfYSdeeQfEN1GoyFwP/gNwnZ7OrIXFCqsX1h1XdHb7AmvrkRlD/CQpmDlhJWaKPIqm7FQqaX2nq+AJDTdZG4eyFxegWPEagrwsYQZAvCroPXQ9yx+9hLbRa8zOIJCGQ0XBGM6hAL2BQNINOVbB7xZEqN09FbqOiBsHpAVi9X5S0VMpGqai/p054oXZ32B5fBUm7zc/7m+t0/XgRe2Y0mx+rnlqcp3cgjufmMP3FntpL06J5y5Hae9Oct9fpdjwdj7fpuqP/7Qnt5/9AYDp8fFNznt2/7fC3bpvd5Xy/Xw6f07th/gJejikknWgJ9AAAAABJRU5ErkJggg==' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAnCAMAAABt2HtiAAAAilBMVEX///+/oWEAAAD39/e+n17o6Oj8/PyPj47v7++6mlK9nlrDw8Pz8/Ps7Ozb29utrKzi4uKCgYFlY2NcWlmfnp59fHvNzc20s7O9vLzj2MHczbDDqG7KsYDGrHb08Oju59rUwJstKCc6NzbPuo+1kT3Yx6bp3864lklMSUhycG8lIB8dGBYNAAAzLy5C8EAwAAACjUlEQVRIidWTaXPjIAyGZcAQX4DNYec+um1D0/7/v7cCO0260506M/tllRmQQc8rCQjAd8aXT+tsvVntvt39u62KkmVZxspiQx/hNkV2tbLYP8CV2Z0Vs8tdFfdcxtYzOT5xjF1TvswDl6lQVqw32SjBNvPApwiW29jZciSLeeAWS2Tb0T+UDxzPmt1Cl4+AG5a62t1lnPcInsusfMZW0d2nHlk2i4vR5Qp2v3bL6QFFmVm2ZQgeigNk403OrBS7K8oDYFrgiSyWMzmAl9cMGGMogf8RzDzf9q/75WvsbFcWqwe4+D+GRxL9E6OW/xQijkfRnlz9uaDOZxxI9aO4INgU+biXwuFnLoEQSLrmNNjjreKrw7/M4yjecTi94aCNNTaB0nxI3BHiIiE37767XBoMcK0wHGpjgxtBLj7yWO8CAHuzKNIQCRWpQWC/OUG1E4ZiOEf/4gHeVCxVkFM6lbdGN8c2gTWCFPsU2PuCoKrrkhg46Umj865LGSURCLbHXqneo8AIgm6FO0VQJxCJpE/GsNSjIujY9+k+JrDHUu0dKKMYwECupxrjDfanIw0WegQpBptYzjmKYKktfpAQ9zlRUxgRGgOxa0WENYvckJ4LEqgiVghiqSCu9kc8NUk61Wk8NKeMhrxZ5HhdtMk5UI85a1zgeVzUnoPUyW/QME/cv03/jeX5OMuvz/rzi8bmqj9XBw29nfz2GtknnU+JE719SZiiZQ9+oF0lQHixaKWVVS/DItgqgKoqJfH48AJrB6Zyg6WhNrryorZqQBActKggcLbU9dSiC44G6b3TCcRqXPrFuZOVbfQASoChhrcyQPDtoC2EOuCz4a3XFvf5WVrfxZjacANBqwo3BvsbJT4pvtgwMUEAAAAASUVORK5CYII=' },
  { symbol: 'TCS.NS', name: 'TCS Ltd.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAWCAMAAACi/q9qAAABF1BMVEX////t8/n6AAC1zuiev+G+0+rE1+zc6PT/+/mvyuaIstsAbb/y9vv/+fmpxuTvAGPk7fb+7PH3+vz/+ev+tgD+1X76lgD8wn31aQD5cVD8pqj7n5/+3Nz+59n+v5v9qob9spz+29X92Kn7vYr6wKT+8e79vGT9hwD8cwD8eSr6SgD8pJj8+P/9phz7pgD6pljzUgBoodT8foP9znL+0MnYhsL+78ZJkc0ggcf+XGaMAML7h3z0AC35fY3+xrb+wsPeyfBtANb4RVzyAEa9e9WhQs36zNj2hKD7sbukAKrasuLzQ27tCHPyeaXVcbq6BaT2vNLvSoztz+ivRMLlY6LRAIX22ujKneHfUp/eAH++AJSyJrPOte90RMAoAAABYklEQVQ4jeWRWVPCQAzHs93LLqWUxQPBW1EEPOqFIgiKokgVqlLP7/85TIEHHsBxeNRkJ8k/s7+dSRbgv1hiUnB6ZjJuanZuQjA5n0ovACwuLa+sho219Y0MJpMSdEr4WNBAS8PmVnY7Z+ShsLO7l93HvnJphLtMRawxYNQ4wHiYzGM8ysBx7gQfw5qyonCVOOXqJzCROxvIknH+yxmj5QrAhVHtq9plxbiKhxUTNuOCMykodZRUknLKTToE1hFMGUd9dX0D1XK9AaBtMKViJt62GdjcFYwxkMNg7Bagatz1hG7eY6cVw5ILQaUW1KFCCCk011xQLYdA7wGgUG71xGM7jJ1YACCt0IFYlpRE6hFD+l7n6bld9ztB46Ub1F6D4M3DtkuUYDYOysCV7qjtxP33j0+n4Xue5wfwVWq2uzgjCIagLBKmiOtwOoqEeG+N0X4aKHDAsUBrPIRYzpgv+cP2DTjpIq4lGLI8AAAAAElFTkSuQmCC' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAWCAMAAACi/q9qAAAAYFBMVEX///8QdL2VttqwyOIbdr7T4O+lwd/F1uq/0uitxuIAb7sAbbrO3O3a5fFwn8/y9vqcutx/qNMker87g8NJisa4zeVmmc1SjsgAabmMsNfr8fddlMrh6vQAZLcxf8F4pNE5C3KBAAABmklEQVQ4jZWT27KrIAyGA0asqIABtR42vP9bLhDprM7Y3Vm5EMjky+FHYBA9vJuujJjgq7VsfXcMcl7nf8dXsEL+7jjPx/ZnsJfDV+YFbu0Ag1nNAduqKPBkho8mp9CT4W39AvQkxLRlsO5MkLOTrNJh9/M4jjvJRZGcYyB/KrPSS4l45EHaCyRK/oHYEcWKKmvvkzqCWai6pLomytzUpTb0eoE4n16BbQxuABxmcQyOyl+7fEPO/Z6xZlmgB8tgw4pglmwupdmSlgHt/8DAyjUa8t6dwiiWegye5u0z6LCkbVDtiHscs2ZjrNtpSxiOT6CnAqbpK4vojphNgxhTE8iUvgeXXxVjKPQL4TYxAZRrebL34MrKfRusrnUFtHWRVEWN78BBhivCs7JRsJJ7lE6kuAUhyFzSsPLoyMCBBEc+6q65B2FhKTnvAiwqzqVDVOaEnzxu9B5nnJyA2poshZ2gtWdS3qGT8UcCLiXD5xzDH50GvUhJ9CyT3Fr9uBQa+vxKrErfrW/qj8ytNd0fgWLWfY+5s4O/F/wBMD0W3cua6mIAAAAASUVORK5CYII=' },
];

const StockSearch = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredStocks = POPULAR_STOCKS.filter(stock =>
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-outline group-focus-within:text-[#adc6ff] transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search stock (e.g., TSLA, AAPL, RELIANCE.NS)"
          className="w-full bg-[#0c0e12] border-none ring-1 ring-white/5 focus:ring-2 focus:ring-[#adc6ff]/20 rounded-full py-4 pl-14 pr-12 text-on-surface placeholder:text-outline/50 transition-all outline-none headline-font font-bold tracking-tight shadow-2xl"
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#adc6ff]"></div>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#adc6ff]/10 text-[#adc6ff]' : 'text-outline hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#1d2023] border border-white/5 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden"
          >
            <div className="max-h-[400px] z-[9999] overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-black text-outline px-4 py-3 uppercase tracking-[0.2em] opacity-50">
                {query ? 'Search Results' : 'Suggested Watchlist'}
              </div>

              {filteredStocks.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline/20 mb-2">query_stats</span>
                  <p className="text-sm text-outline font-medium">No direct matches. Press Enter to analyze "{query}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        setQuery(stock.symbol);
                        onSearch(stock.symbol);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#323539] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0c0e12] flex items-center justify-center border border-white/5 group-hover:border-[#adc6ff]/20 transition-all overflow-hidden">
                          <img src={stock.icon} alt={stock.symbol} className="w-8 h-8 object-contain" />
                        </div>
                        <div className="text-left">
                          <div className="font-headline font-black text-on-surface group-hover:text-[#adc6ff] transition-colors">{stock.symbol}</div>
                          <div className="text-[10px] font-bold text-outline uppercase tracking-wider">{stock.name}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="material-symbols-outlined text-outline group-hover:text-[#adc6ff] transition-all translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">arrow_forward_ios</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockSearch;
