// @ts-nocheck
var selenium = require('selenium-webdriver');
var spawn = require('child_process').spawn;

var oldSpawn = spawn;
function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
}
spawn = mySpawn;

var proc;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;



function wait(ms = 1000) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}
beforeEach(function(done) {
    this.driver = new selenium.Builder().forBrowser('chrome').build();
    this.driver.get('http://localhost:1962/#personnelview').then(done);
});

// Close the website after each test is run (so that it is opened fresh each time)
afterEach(function(done) {
    this.driver.quit().then(done);
});


describe("Loading the personnel page", function() {
    // beforeAll(function(done) {
    //     proc = spawn('C:\\Program Files\\nodejs\\npm.cmd start', {shell: true});
    //
    //     proc.stdout.on('data', (data) => {
    //         console.log(data);
    //         if(data === 'Compiled successfully.') {
    //             done();
    //         }
    //     });
    //     proc.on('close', (code, signal) => {
    //         console.log('child process terminated due to receipt of signal ${signal}');
    //     });
    //     proc.on('exit', () => {
    //         console.log("exited");
    //     });
    // });
    //
    // afterAll(function() {
    //     console.log('Killing');
    //     proc.kill();
    // });

    it("should show the personnel in the grid", function(done) {
        var pv = this.driver.findElement(selenium.By.className("personnelview"));
        var children = pv.findElements(selenium.By.className("x-gridrow"));
        children.then(function(res) {
            expect(res.length).toBe(4);
            done();
        });
    });

    it("should navigate to the homepage when the link is clicked", function(done) {
        var link = this.driver.findElement(selenium.By.css('#ext-treelistitem-1'));
        link.click().then(() => {
            this.driver.getCurrentUrl().then((url) => {
                expect(url).toBe("http://localhost:1962/#homeview");
                done();
            });
        });
    });
});

describe("The detail view popout", function() {
    it("should begin compressed", function(done) {
        var popout = this.driver.findElement(selenium.By.css('.detailview'));
        popout.getCssValue("width").then((width) => {
            expect(width).toBe("0px");
            done();
        });
    });
    it("should expand when the arrow button is clicked and shrink when clicked again", function(done) {
        var button = this.driver.findElement(selenium.By.css("#detailview-expand"));
        button.click().then(() => {
            var popout = this.driver.findElement(selenium.By.css('.detailview'));
            popout.getCssValue("width").then((width) => {
                expect(width).toBe("300px");

                button.click().then(() => {
                    popout.getCssValue("width").then((width) => {
                        expect(width).toBe("0px");
                        done();
                    });
                });
            });
        })
    });

    it("should add to the personnel list when a record is entered", function(done) {
        var button = this.driver.findElement(selenium.By.xpath("//*[@data-componentid=\"detailview-expand\"]"));
        button.click().then(() => {
            var popout;
            this.driver.findElement(selenium.By.css('.detailview'))
                .then(popout_found => {
                    popout = popout_found;
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-name"]'))
                })
                .then(el => {
                    return el[1].sendKeys("Sam Griffin");
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-email"]'))
                })
                .then(el => {
                    return el[1].sendKeys("sam.griffin@verint.com")
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-phone"]'))
                })
                .then(el => {
                    return el[1].sendKeys("0722213499");
                })
                .then(() => {
                    popout.findElement(selenium.By.xpath('//*[@id="ext-element-80"]'))
                        .click()
                        .then(() => {
                            this.driver.findElements(selenium.By.css(".personnelview .x-gridrow"))
                                .then(function(res) {
                                    expect(res.length).toBe(5);
                                    res[4].findElements(selenium.By.className('x-gridcell-body-el'))
                                        .then(els => {
                                            var text_promises = [];
                                            for (var i = 0; i < els.length; i++) {
                                                text_promises.push(els[i].getText());
                                            }
                                            Promise.all(text_promises).then(values => {
                                                expect(values[0]).toBe("Sam Griffin");
                                                expect(values[1]).toBe("sam.griffin@verint.com");
                                                expect(values[2]).toBe("0722213499");
                                                done();
                                            });
                                        });
                                });
                        });
                });
        });
    });

    it("should allow multiple entries to be added", function(done) {
        var button = this.driver.findElement(selenium.By.xpath("//*[@data-componentid=\"detailview-expand\"]"));
        button.click().then(() => {
            var popout;
            this.driver.findElement(selenium.By.css('.detailview'))
                .then(popout_found => {
                    popout = popout_found;
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-name"]'))
                })
                .then(el => {
                    return el[1].sendKeys("Sam Griffin");
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-email"]'))
                })
                .then(el => {
                    return el[1].sendKeys("sam.griffin@verint.com")
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-phone"]'))
                })
                .then(el => {
                    return el[1].sendKeys("0722213499");
                })
                .then(p => {
                    return popout.findElement(selenium.By.xpath('//*[@id="ext-element-80"]')).click();
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-name"]'))
                })
                .then(el => {
                    return el[1].sendKeys("Sam Griffin2");
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-email"]'))
                })
                .then(el => {
                    return el[1].sendKeys("sam.griffin2@verint.com")
                })
                .then(p => {
                    return popout.findElements(selenium.By.xpath('//*[@data-componentid="new-personnel-phone"]'))
                })
                .then(el => {
                    return el[1].sendKeys("0722213499");
                })
                .then(() => {
                    popout.findElement(selenium.By.xpath('//*[@id="ext-element-80"]'))
                        .click()
                        .then(() => {
                            this.driver.findElements(selenium.By.css(".personnelview .x-gridrow"))
                                .then(function(res) {
                                    expect(res.length).toBe(6);
                                    res[4]
                                        .findElements(selenium.By.className('x-gridcell-body-el'))
                                        .then(els => {
                                            var text_promises = [];
                                            for (var i = 0; i < els.length; i++) {
                                                text_promises.push(els[i].getText());
                                            }
                                            return Promise.all(text_promises);
                                        })
                                        .then(values => {
                                            expect(values[0]).toBe("Sam Griffin");
                                            expect(values[1]).toBe("sam.griffin@verint.com");
                                            expect(values[2]).toBe("0722213499");

                                            return res[5].findElements(selenium.By.className('x-gridcell-body-el'))
                                        })
                                        .then(els => {
                                            var text_promises = [];
                                            for (var i = 0; i < els.length; i++) {
                                                text_promises.push(els[i].getText());
                                            }
                                            return Promise.all(text_promises);
                                        })
                                        .then(values => {
                                            expect(values[0]).toBe("Sam Griffin2");
                                            expect(values[1]).toBe("sam.griffin2@verint.com");
                                            expect(values[2]).toBe("0722213499");
                                            done();
                                        });
                                });
                        });
                });
        });
    });
});

describe("Deleting a personnel from the list", function() {
    describe("has a confirmation popup", function() {
        it("should delete the correct person on confirm", function(done) {
            var person_id = null;
            var person;
            var messagebox;
            this.driver.findElements(selenium.By.css('.personnelview .x-gridrow'))
                .then(els => {
                    person = els[els.length - 1];
                    return person.getAttribute('data-componentid');
                })
                .then((pid => {
                    person_id = pid;
                    return person.findElements(selenium.By.className('x-gridcell-body-el'))
                }))
                .then(els => {
                    var text_promises = [];
                    for (var i = 0; i < els.length; i++) {
                        text_promises.push(els[i].getText());
                    }
                    return Promise.all(text_promises);
                })
                .then(values => {
                    return person.click();
                })
                .then(p => {
                    return this.driver.findElements(selenium.By.css('.x-messagebox'));
                })
                .then(els => {
                    messagebox = els[0];
                    return els[0].getAttribute("class");
                })
                .then((c) => {
                    expect(c.indexOf("x-hidden") === -1).toBe(true);

                    return messagebox.findElements(selenium.By.css('.x-button-el'));
                })
                .then(els => {
                    return els[0].click();
                })
                .then(p => {
                    console.log(person_id);

                    //wait for animations etc.
                    wait();


                    return this.driver.findElements(selenium.By.css('.personnelview .x-gridrow[data-componentid="' + person_id + '"]'));
                })
                .then(els => {
                    expect(els.length).toBe(0);
                    done();
                });
        });

        it("should not delete the person on cancel", function(done) {
            var person_id = 0;
            var person;
            var messagebox;
            this.driver.findElements(selenium.By.css('.personnelview .x-gridrow'))
                .then(els => {
                    person = els[els.length - 1];
                    return person.getAttribute('data-componentid');
                })
                .then((pid => {
                    person_id = pid;
                    return person.findElements(selenium.By.className('x-gridcell-body-el'))
                }))
                .then(els => {
                    var text_promises = [];
                    for (var i = 0; i < els.length; i++) {
                        text_promises.push(els[i].getText());
                    }
                    return Promise.all(text_promises);
                })
                .then(values => {
                    return person.click();
                })
                .then(p => {
                    return this.driver.findElements(selenium.By.css('.x-messagebox'));
                })
                .then(els => {
                    messagebox = els[0];
                    return els[0].getAttribute("class");
                })
                .then((c) => {
                    expect(c.indexOf("x-hidden") === -1).toBe(true);

                    return messagebox.findElements(selenium.By.css('.x-button-el'));
                })
                .then(els => {
                    return els[1].click();
                })
                .then(p => {
                    return this.driver.findElements(selenium.By.css('.personnelview .x-gridrow[data-componentid="' + person_id + '"]'));
                })
                .then(els => {
                    expect(els.length).toBe(1);
                    done();
                });
        });
    });
});